import { Ajuizamento } from './Ajuizamento';
import { Competencia, possui } from './Competencia';
import { Distribuicao } from './Distribuicao';
import { Grupo } from './Grupo';
import { Juizo, fromVara } from './Juizo';
import { sortearComPeso } from './sortearComPeso';
import { take } from './take';
import * as A from './Array';
import { Redistribuicao } from './Redistribuicao';
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

export function* algoritmoV3(
	distribuicoes: Iterable<Distribuicao>,
	grupo: Grupo,
): IterableIterator<Redistribuicao> {
	const juizos = take(grupo.varas).return(A.chain(fromVara));
	const juizosPorCompetencia = take(juizos)
		.apply(A.ap(apCompetencias))
		.apply(A.filter(([c, j]) => take(j.vara.competencia).return(possui(c))))
		.return(A.toMap(x => x));
	const ultimoFoiRedistribuido = juizos.map(() => false);
	let contadores = juizos.map(() => 0);
	let mesAtual = '';
	let distribuidos = juizos.map(() => 0);
	for (const distribuicao of distribuicoes) {
		if (distribuicao.competencia !== grupo.competencia) continue;
		if (distribuicao.mes !== mesAtual) {
			const media = calcularMedia(distribuidos);
			contadores = A.zipWith((d: number) => (c: number) => Math.round(c + d - media))(distribuidos)(
				contadores,
			);
			distribuidos = juizos.map(() => 0);
			mesAtual = distribuicao.mes;
		}

		const indiceJuizoOrigem = juizos.findIndex(juizo => juizo.sigla === distribuicao.juizo.sigla);
		distribuidos[indiceJuizoOrigem]++;
		if (indiceJuizoOrigem === -1) continue;
		let redistribuir = false;
		if (!ultimoFoiRedistribuido[indiceJuizoOrigem]) {
			redistribuir = contadores[indiceJuizoOrigem] > 0;
		}
		let juizosAptos: Juizo[] = [];
		if (redistribuir) {
			juizosAptos = (juizosPorCompetencia.get(distribuicao.competencia) as Juizo[]).filter(
				juizoCompetente => contadores[juizos.indexOf(juizoCompetente)] < 0,
			);
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
			ultimoFoiRedistribuido[indiceJuizoOrigem] = false;
		}
	}
}
