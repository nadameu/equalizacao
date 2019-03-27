export const enum Competencia {
	CRIMINAL = 1,
	EXECUCAO_FISCAL = 2,
	PREVIDENCIARIA = 4,
	CIVEL = 8,
	UNICA = 12,
}

export const possui = (esperado: Competencia) => (obtido: Competencia) =>
	(obtido & esperado) === esperado;

export const show = (competencia: Competencia): string => {
	switch (competencia) {
		case Competencia.CRIMINAL:
			return 'CRIMINAL';

		case Competencia.EXECUCAO_FISCAL:
			return 'EXECUCAO_FISCAL';

		case Competencia.PREVIDENCIARIA:
			return 'PREVIDENCIARIA';

		case Competencia.CIVEL:
			return 'CIVEL';

		case Competencia.UNICA:
			return 'UNICA';
	}
};
