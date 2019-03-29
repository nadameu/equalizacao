import { Competencia } from './Competencia';
import { deepClone } from './deepClone';
import { sortearComPeso } from './sortearComPeso';
import { Subsecao } from './Subsecao';

export interface Ajuizamento {
	numeroProcesso: string;
	mes: string;
	subsecao: Subsecao;
	competencia: Competencia;
}

function formatNumber(num: number, digits: number): string {
	return String(num).padStart(digits, '0');
}

type State = Record<number, InfoAno>;

interface InfoAno {
	seq: Record<string, number>;
	meses: Record<number, InfoMes>;
}

interface InfoMes {
	subsecoesCompetencias: [string, Competencia][];
	ajuizar: number[];
}

export const fromDados = (
	dists: [string, string, Competencia, number][],
	subsecoes: Record<string, Subsecao>,
): Iterable<Ajuizamento> => {
	const state: State = {};
	for (const [textoMes, siglaSubsecao, competencia, qtdProcessos] of dists) {
		const [mes, ano] = textoMes.split('/').map(Number);
		const { meses } = state[ano] || (state[ano] = { seq: {}, meses: {} });
		const { subsecoesCompetencias, ajuizar } =
			meses[mes] ||
			(meses[mes] = {
				subsecoesCompetencias: [],
				ajuizar: [],
			});
		const indiceSubCom = (() => {
			const indice = subsecoesCompetencias.findIndex(
				([s, c]) => s === siglaSubsecao && c === competencia,
			);
			if (indice === -1) {
				subsecoesCompetencias.push([siglaSubsecao, competencia]);
				ajuizar.push(0);
				return subsecoesCompetencias.length - 1;
			}
			return indice;
		})();
		ajuizar[indiceSubCom] = (ajuizar[indiceSubCom] || 0) + qtdProcessos;
	}
	return {
		*[Symbol.iterator]() {
			const anos = deepClone(state);
			for (const ano of Object.keys(anos)
				.map(Number)
				.sort((a, b) => a - b)) {
				const { seq, meses } = anos[ano];
				for (const mes of Object.keys(meses)
					.map(Number)
					.sort((a, b) => a - b)) {
					const { subsecoesCompetencias, ajuizar } = meses[mes];
					while (ajuizar.some(x => x > 0)) {
						const indiceSorteado = sortearComPeso(ajuizar);
						const [siglaSubsecao, competencia] = subsecoesCompetencias[indiceSorteado];
						seq[siglaSubsecao] = (seq[siglaSubsecao] || 0) + 1;
						const seqFormatado = formatNumber(seq[siglaSubsecao], 6);
						const subsecao = subsecoes[siglaSubsecao];
						const cod = formatNumber(subsecao.cod, 2);
						yield {
							numeroProcesso: `5${seqFormatado}-XX.${ano}.4.04.72${cod}`,
							mes: `${formatNumber(mes, 2)}/${ano}`,
							competencia,
							subsecao,
						};
						ajuizar[indiceSorteado]--;
					}
				}
			}
		},
	};
};
