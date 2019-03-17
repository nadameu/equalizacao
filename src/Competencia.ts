export const enum Competencia {
	CRIMINAL = 1,
	EXECUCAO_FISCAL = 2,
	PREVIDENCIARIA = 4,
	CIVEL = 8,
	UNICA = 12,
}

export const isCriminal = (competencia: Competencia) =>
	(competencia & Competencia.CRIMINAL) === Competencia.CRIMINAL;
export const isExecucaoFiscal = (competencia: Competencia) =>
	(competencia & Competencia.EXECUCAO_FISCAL) === Competencia.EXECUCAO_FISCAL;
export const isPrevidenciaria = (competencia: Competencia) =>
	(competencia & Competencia.PREVIDENCIARIA) === Competencia.PREVIDENCIARIA;
export const isCivel = (competencia: Competencia) =>
	(competencia & Competencia.CIVEL) === Competencia.CIVEL;
