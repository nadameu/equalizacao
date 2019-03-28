import { Competencia } from './Competencia';
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

interface InfoAjuizamento {
	siglaSubsecao: string;
	competencia: Competencia;
	qtdProcessos: number;
}

export function* fromDados(
	dists: [string, string, Competencia, number][],
	subsecoes: Record<string, Subsecao>,
): IterableIterator<Ajuizamento> {
	const siglas = Array.from(Object.keys(subsecoes));
	let seq = siglas.map(() => 1);
	let mesAtual = '';
	let anoAtual = '';
	let ajuizar: InfoAjuizamento[] = [];
	for (const [mes, siglaSubsecao, competencia, qtdProcessos] of dists) {
		if (mes !== mesAtual) {
			while (ajuizar.some(({ qtdProcessos }) => qtdProcessos > 0)) {
				const pesos = ajuizar.map(({ qtdProcessos }) => qtdProcessos);
				const indiceSorteado = sortearComPeso(pesos);
				const { siglaSubsecao, competencia, qtdProcessos } = ajuizar[indiceSorteado];
				const indiceSigla = siglas.indexOf(siglaSubsecao);
				const seqFormatado = formatNumber(seq[indiceSigla], 6);
				const ano = mesAtual.split('/')[1];
				const subsecao = subsecoes[siglaSubsecao];
				const codSubsecao = formatNumber(subsecao.cod, 2);
				yield {
					numeroProcesso: `5${seqFormatado}-XX.${ano}.4.04.72${codSubsecao}`,
					mes: mesAtual,
					subsecao,
					competencia,
				};
				seq[indiceSigla]++;
				ajuizar[indiceSorteado].qtdProcessos--;
			}
			mesAtual = mes;
			ajuizar = [];
			const ano = mesAtual.split('/')[1];
			if (ano !== anoAtual) {
				seq = siglas.map(() => 1);
				anoAtual = ano;
			}
		}
		ajuizar.push({ siglaSubsecao, competencia, qtdProcessos });
	}
}
