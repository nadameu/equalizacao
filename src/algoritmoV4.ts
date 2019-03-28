import { ap, chain, filter, toMap, zipWith } from './Array';
import { Competencia, possui } from './Competencia';
import { Distribuicao } from './Distribuicao';
import { Grupo } from './Grupo';
import { fromVara, Juizo } from './Juizo';
import { K } from './K';
import { Redistribuicao } from './Redistribuicao';
import { sortearComPeso } from './sortearComPeso';
import { T, T2 } from './T';
import { calcularMedia } from './utils';

const competencias = [
	Competencia.CRIMINAL,
	Competencia.EXECUCAO_FISCAL,
	Competencia.PREVIDENCIARIA,
	Competencia.CIVEL,
];

const apCompetencias = competencias.map(competencia => (juizo: Juizo): [Competencia, Juizo] => [
	competencia,
	juizo,
]);

function redistribuicao(distribuicao: Distribuicao, destino: Juizo): Redistribuicao {
	const { juizo: origem, ...resto } = distribuicao;
	return { ...resto, origem, destino };
}

export function* algoritmoV4(
	distribuicoes: Iterable<Distribuicao>,
	grupo: Grupo,
): IterableIterator<Redistribuicao> {
	const ehGrupoPrevidenciarioComVaraUnica =
		grupo.competencia === Competencia.PREVIDENCIARIA &&
		grupo.varas.some(vara => vara.competencia === Competencia.UNICA);
	const juizos = grupo.varas.do(chain(fromVara));
	const LIMIAR = 64;
	const juizosPorCompetencia = juizos
		.do(ap(apCompetencias))
		.do(filter(([c, j]) => T(j.vara.competencia)(possui(c))))
		.do(toMap(x => x));
	const ultimoFoiRedistribuido = juizos.map(() => false);
	let contadores = juizos.map(() => 0);
	let mesAtual = '';
	for (const distribuicao of distribuicoes) {
		if (distribuicao.mes !== mesAtual) {
			const minimo = Math.min(...contadores);
			contadores = contadores.map(x => x - minimo);
			mesAtual = distribuicao.mes;
		}

		const indiceJuizoOrigem = juizos.findIndex(juizo => juizo.sigla === distribuicao.juizo.sigla);
		if (indiceJuizoOrigem === -1) continue;
		if (ehGrupoPrevidenciarioComVaraUnica && distribuicao.competencia === Competencia.CIVEL) {
			contadores[indiceJuizoOrigem] += 1.74;
		} else {
			contadores[indiceJuizoOrigem]++;
		}
		let redistribuir = false;
		let juizosAptos: Juizo[] = [];
		if (distribuicao.competencia === grupo.competencia) {
			if (ultimoFoiRedistribuido[indiceJuizoOrigem]) {
				ultimoFoiRedistribuido[indiceJuizoOrigem] = false;
			} else {
				redistribuir = contadores[indiceJuizoOrigem] > Math.min(...contadores) + LIMIAR;
			}
			if (redistribuir) {
				juizosAptos = (juizosPorCompetencia.get(distribuicao.competencia) as Juizo[]).filter(
					juizoCompetente =>
						contadores[juizos.indexOf(juizoCompetente)] < contadores[indiceJuizoOrigem] - LIMIAR,
				);
			}
		}
		if (redistribuir && juizosAptos.length > 0) {
			const juizo = juizosAptos[sortearComPeso(juizosAptos.map(() => 1))];
			yield redistribuicao(distribuicao, juizo);
			contadores[indiceJuizoOrigem]--;
			const indiceJuizoDestino = juizos.indexOf(juizo);
			contadores[indiceJuizoDestino]++;
			ultimoFoiRedistribuido[indiceJuizoOrigem] = true;
		} else {
			yield redistribuicao(distribuicao, distribuicao.juizo);
		}
	}
}
