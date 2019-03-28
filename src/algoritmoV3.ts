import * as Arr from './Array';
import { Competencia, possui } from './Competencia';
import { Distribuicao } from './Distribuicao';
import { Grupo } from './Grupo';
import { fromVara, Juizo } from './Juizo';
import { K } from './K';
import { Redistribuicao } from './Redistribuicao';
import { sortearComPeso } from './sortearComPeso';
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
	const juizos = grupo.varas.do(Arr.chain(fromVara));
	const juizosPorCompetencia = juizos
		.do(Arr.ap(apCompetencias))
		.do(Arr.filter(([c, j]) => j.vara.competencia.do(possui(c))))
		.do(Arr.toMap(x => x));
	const ultimoFoiRedistribuido = juizos.map(() => false);
	let contadores = juizos.map(() => 0);
	let mesAtual = '';
	let distribuidos = competencias.map(() => juizos.map(() => 0));
	for (const distribuicao of distribuicoes) {
		if (distribuicao.mes !== mesAtual) {
			if (
				grupo.competencia === Competencia.PREVIDENCIARIA &&
				grupo.varas.some(vara => vara.competencia === Competencia.UNICA)
			) {
				const indiceCivel = competencias.indexOf(Competencia.CIVEL);
				const indicePrev = competencias.indexOf(Competencia.PREVIDENCIARIA);
				const distribuidosCiveisK = distribuidos[indiceCivel].map(x => x * K);
				const distribuidosPrev = distribuidos[indicePrev];
				const distribuidosK = distribuidosCiveisK.do(
					distribuidosPrev.do(Arr.zipWith(p => c => p + c)),
				);
				const media = calcularMedia(distribuidosK);
				contadores = contadores.do(
					distribuidosK.do(Arr.zipWith(d => c => Math.round(c + d - media))),
				);
			} else {
				const indiceEstaCompetencia = competencias.indexOf(grupo.competencia);
				const distribuidosEstaCompetencia = distribuidos[indiceEstaCompetencia];
				const media = calcularMedia(distribuidosEstaCompetencia);
				contadores = contadores.do(
					distribuidosEstaCompetencia.do(Arr.zipWith(d => c => Math.round(c + d - media))),
				);
			}
			distribuidos = competencias.map(() => juizos.map(() => 0));
			mesAtual = distribuicao.mes;
		}
		const distribuidosCompetencia = distribuidos[competencias.indexOf(distribuicao.competencia)];

		const indiceJuizoOrigem = juizos.findIndex(juizo => juizo.sigla === distribuicao.juizo.sigla);
		distribuidosCompetencia[indiceJuizoOrigem]++;
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
