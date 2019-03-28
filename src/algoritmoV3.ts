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

export const algoritmoV3 = (
	distribuicoes: Iterable<Distribuicao>,
	grupo: Grupo,
): Iterable<Redistribuicao> => ({
	*[Symbol.iterator]() {
		const ehGrupoPrevidenciarioComVaraUnica =
			grupo.competencia === Competencia.PREVIDENCIARIA &&
			grupo.varas.some(vara => vara.competencia === Competencia.UNICA);
		const juizos = grupo.varas.do(chain(fromVara));
		const juizosPorCompetencia = juizos
			.do(ap(apCompetencias))
			.do(filter(([c, j]) => T(j.vara.competencia)(possui(c))))
			.do(toMap(x => x));
		const ultimoFoiRedistribuido = juizos.map(() => false);
		let contadores = juizos.map(() => 0);
		let mesAtual = '';
		let distribuidos = competencias.map(() => juizos.map(() => 0));
		for (const distribuicao of distribuicoes) {
			if (distribuicao.mes !== mesAtual) {
				if (ehGrupoPrevidenciarioComVaraUnica) {
					const indiceCivel = competencias.indexOf(Competencia.CIVEL);
					const indicePrev = competencias.indexOf(Competencia.PREVIDENCIARIA);
					const distribuidosCiveisK = distribuidos[indiceCivel].map(x => x * K);
					const distribuidosPrev = distribuidos[indicePrev];
					const distribuidosK = T2(distribuidosPrev)(distribuidosCiveisK)(zipWith(p => c => p + c));
					const media = calcularMedia(distribuidosK);
					contadores = T2(distribuidosK)(contadores)(zipWith(d => c => Math.round(c + d - media)));
				} else {
					const indiceEstaCompetencia = competencias.indexOf(grupo.competencia);
					const distribuidosEstaCompetencia = distribuidos[indiceEstaCompetencia];
					const media = calcularMedia(distribuidosEstaCompetencia);
					contadores = T2(distribuidosEstaCompetencia)(contadores)(
						zipWith(d => c => Math.round(c + d - media)),
					);
				}
				distribuidos = competencias.map(() => juizos.map(() => 0));
				mesAtual = distribuicao.mes;
			}
			const distribuidosCompetencia = distribuidos[competencias.indexOf(distribuicao.competencia)];

			const indiceJuizoOrigem = juizos.findIndex(juizo => juizo.sigla === distribuicao.juizo.sigla);
			if (indiceJuizoOrigem === -1) continue;
			distribuidosCompetencia[indiceJuizoOrigem]++;
			let redistribuir = false;
			let juizosAptos: Juizo[] = [];
			if (distribuicao.competencia === grupo.competencia) {
				if (ultimoFoiRedistribuido[indiceJuizoOrigem]) {
					ultimoFoiRedistribuido[indiceJuizoOrigem] = false;
				} else {
					redistribuir = contadores[indiceJuizoOrigem] > 0;
				}
				if (redistribuir) {
					juizosAptos = (juizosPorCompetencia.get(distribuicao.competencia) as Juizo[]).filter(
						juizoCompetente => contadores[juizos.indexOf(juizoCompetente)] < 0,
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
	},
});
