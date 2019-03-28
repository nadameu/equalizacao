import { Competencia } from './Competencia';
import * as ss from '../dados/subsecoes';
import { sortearComPeso } from './sortearComPeso';
import { Subsecao } from './Subsecao';
import * as Arr from './Array';

const subsecoes: Record<string, Subsecao> = ss;

export interface Ajuizamento {
	numeroProcesso: string;
	mes: string;
	subsecao: Subsecao;
	competencia: Competencia;
}

export function* fromDados(
	dists: [string, string, Competencia, number][],
): IterableIterator<Ajuizamento> {
	const subsecaoCompetencia = dists
		.do(Arr.toMap(([_, siglaSubsecao, competencia]) => [subsecoes[siglaSubsecao], competencia]))
		.do(map => Array.from(map.entries()))
		.do(
			Arr.chain(([subsecao, competencias]) =>
				Arr.unique(competencias).do(Arr.map(competencia => ({ subsecao, competencia }))),
			),
		);
	const porMes = dists.reduce((map, [mes, subsecao, competencia, distribuidos]) => {
		const array = map.get(mes) || Array.from({ length: subsecaoCompetencia.length }, () => 0);
		const indice = subsecaoCompetencia.findIndex(
			({ subsecao: s, competencia: c }) => s.sigla === subsecao && c === competencia,
		);
		array[indice] = distribuidos;
		map.set(mes, array);
		return map;
	}, new Map<string, number[]>());
	const seqs = new Map<number, Map<Subsecao, number>>();
	for (const [mes, dados] of porMes.entries()) {
		const ano = Number(mes.split('/')[1]);
		const seqsAno = seqs.get(ano) || new Map<Subsecao, number>();
		while (dados.some(x => x > 0)) {
			const indice = sortearComPeso(dados);
			const { subsecao, competencia } = subsecaoCompetencia[indice];
			const seq = (seqsAno.get(subsecao) || 0) + 1;
			yield {
				numeroProcesso: `5${seq
					.toString()
					.padStart(6, '0')}-__.${ano}.4.04.72${subsecao.cod.toString().padStart(2, '0')}`,
				mes,
				subsecao,
				competencia,
			};
			seqsAno.set(subsecao, seq);
			dados[indice]--;
		}
	}
}
