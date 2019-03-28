export enum Competencia {
	CRIMINAL = 1,
	EXECUCAO_FISCAL = 2,
	PREVIDENCIARIA = 4,
	CIVEL = 8,
	UNICA = 12,
}

export const possui = (esperado: Competencia) => (obtido: Competencia) =>
	(obtido & esperado) === esperado;

export const show = (competencia: Competencia): string => Competencia[competencia];
