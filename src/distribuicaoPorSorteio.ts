import * as grupos from '../dados/grupos';
import * as varas from '../dados/varas';
import { Ajuizamento } from './Ajuizamento';
import { alt, chain, filter, toMapi } from './Array';
import { possui, show as showCompetencia } from './Competencia';
import { Distribuicao } from './Distribuicao';
import { fromVara } from './Juizo';
import { sortearComPeso } from './sortearComPeso';

const juizos = Object.values(varas).do(chain(fromVara));
const indicesJuizosPorVara = juizos.do(toMapi(juizo => i => [juizo.vara, i]));

export const distribuicaoPorSorteio = (
	ajuizamentos: Iterable<Ajuizamento>,
): Iterable<Distribuicao> => ({
	*[Symbol.iterator]() {
		const distribuidos = juizos.map(() => 0);
		for (const ajuizamento of ajuizamentos) {
			const varasSubsecao = Object.values(varas)
				.do(filter(({ competencia }) => competencia.do(possui(ajuizamento.competencia))))
				.do(filter(({ subsecao }) => subsecao === ajuizamento.subsecao));
			const varasGrupo = Object.values(grupos)
				.do(filter(({ competencia }) => competencia.do(possui(ajuizamento.competencia))))
				.do(filter(({ subsecoes }) => subsecoes.includes(ajuizamento.subsecao)))
				.do(chain(grupo => grupo.varas));
			const varasCompetentes = varasSubsecao.do(alt(varasGrupo));

			if (varasCompetentes.length === 0) {
				throw new Error(
					`Não encontrados juízos competentes para a competência ${showCompetencia(
						ajuizamento.competencia,
					)} e subseção ${ajuizamento.subsecao.sigla}.`,
				);
			}

			const indicesJuizosCompetentes = varasCompetentes.do(
				chain(vara => indicesJuizosPorVara.get(vara) as number[]),
			);
			const distribuidosJuizosCompetentes = indicesJuizosCompetentes.map(i => distribuidos[i]);
			const menor = Math.min(...distribuidosJuizosCompetentes);
			const segundoMenor = Math.min(
				menor,
				...distribuidosJuizosCompetentes.filter(x => x !== menor),
			);
			const diferenca = segundoMenor - menor;
			const pesos = distribuidosJuizosCompetentes.map(x =>
				x === menor ? diferenca + 1 : x === segundoMenor ? 1 : 0,
			);
			const indiceJuizoSorteado = indicesJuizosCompetentes[sortearComPeso(pesos)];
			const juizo = juizos[indiceJuizoSorteado];
			yield {
				...ajuizamento,
				juizo,
			};
		}
	},
});
