import * as grupos from '../dados/grupos';
import * as varas from '../dados/varas';
import { Ajuizamento } from './Ajuizamento';
import * as A from './Array';
import { possui, show as showCompetencia } from './Competencia';
import { Distribuicao } from './Distribuicao';
import { fromVara } from './Juizo';
import { sortearComPeso } from './sortearComPeso';
import { take } from './take';

const juizos = take(Object.values(varas)).return(A.chain(fromVara));
const indicesJuizosPorVara = take(juizos).return(A.toMapi(juizo => i => [juizo.vara, i]));

export function* distribuicaoPorSorteio(
	ajuizamentos: Iterable<Ajuizamento>,
): IterableIterator<Distribuicao> {
	const distribuidos = juizos.map(() => 0);
	for (const ajuizamento of ajuizamentos) {
		const varasSubsecao = Object.values(varas)
			.filter(({ competencia }) => take(competencia).return(possui(ajuizamento.competencia)))
			.filter(({ subsecao }) => subsecao === ajuizamento.subsecao);
		const varasGrupo = take(
			Object.values(grupos)
				.filter(({ competencia }) => take(competencia).return(possui(ajuizamento.competencia)))
				.filter(({ subsecoes }) => subsecoes.includes(ajuizamento.subsecao)),
		).return(A.chain(grupo => grupo.varas));
		const varasCompetentes = take(varasSubsecao).return(A.alt(varasGrupo));

		if (varasCompetentes.length === 0) {
			throw new Error(
				`Não encontrados juízos competentes para a competência ${showCompetencia(
					ajuizamento.competencia,
				)} e subseção ${ajuizamento.subsecao.sigla}.`,
			);
		}

		const indicesJuizosCompetentes = take(varasCompetentes).return(
			A.chain(vara => indicesJuizosPorVara.get(vara) as number[]),
		);
		const distribuidosJuizosCompetentes = indicesJuizosCompetentes.map(i => distribuidos[i]);
		const menor = Math.min(...distribuidosJuizosCompetentes);
		const segundoMenor = Math.min(menor, ...distribuidosJuizosCompetentes.filter(x => x !== menor));
		const pesos = distribuidosJuizosCompetentes.map(x =>
			x === menor ? segundoMenor - menor + 1 : x === segundoMenor ? 1 : 0,
		);
		const indiceJuizoSorteado = indicesJuizosCompetentes[sortearComPeso(pesos)];
		const juizo = juizos[indiceJuizoSorteado];
		yield {
			...ajuizamento,
			juizo,
		};
	}
}
