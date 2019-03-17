import { Competencia } from '../src/Competencia';
import { Grupo } from '../src/Grupo';
import {
	SCBLU,
	SCBQE,
	SCCAC,
	SCCHA,
	SCCON,
	SCCRI,
	SCFLP,
	SCITA,
	SCJAR,
	SCJOA,
	SCJOI,
	SCLAG,
	SCLGA,
	SCMFA,
	SCRSL,
	SCSMO,
	SCTUB,
} from './subsecoes';
import {
	SCBLU01,
	SCBLU02,
	SCBLU03,
	SCBLU04,
	SCBLU05,
	SCBQE01,
	SCCAC01,
	SCCHA01,
	SCCHA02,
	SCCHA03,
	SCCON01,
	SCCRI01,
	SCCRI02,
	SCCRI03,
	SCCRI04,
	SCFLP01,
	SCFLP02,
	SCFLP03,
	SCFLP04,
	SCFLP05,
	SCFLP06,
	SCFLP07,
	SCFLP08,
	SCFLP09,
	SCITA01,
	SCITA02,
	SCITA03,
	SCITA04,
	SCJAR01,
	SCJAR02,
	SCJOA01,
	SCJOI01,
	SCJOI02,
	SCJOI03,
	SCJOI04,
	SCJOI05,
	SCJOI06,
	SCLAG01,
	SCLAG02,
	SCLGA01,
	SCMFA01,
	SCRSL01,
	SCSMO01,
	SCTUB01,
	SCTUB02,
} from './varas';

// Art. 22
export const A: Grupo = {
	competencia: Competencia.CRIMINAL,
	subsecoes: [SCJAR, SCJOI, SCMFA],
	varas: [SCJOI01],
};

// Art. 5º
export const B: Grupo = {
	competencia: Competencia.CRIMINAL,
	subsecoes: [SCITA, SCBLU],
	varas: [SCITA01],
};

// Art. 4º
export const C: Grupo = {
	competencia: Competencia.CRIMINAL,
	subsecoes: [SCFLP, SCBQE, SCCAC, SCJOA, SCRSL],
	varas: [SCFLP01, SCFLP07],
};

// Art. 3º
export const D: Grupo = {
	competencia: Competencia.CRIMINAL,
	subsecoes: [SCCRI, SCLAG, SCLGA, SCTUB],
	varas: [SCCRI01],
};

// Art. 2º
export const E: Grupo = {
	competencia: Competencia.CRIMINAL,
	subsecoes: [SCCHA, SCCON, SCSMO],
	varas: [SCCHA01],
};

// Art. 6º
export const F: Grupo = {
	competencia: Competencia.EXECUCAO_FISCAL,
	subsecoes: [
		SCFLP,
		SCJOI,
		SCCHA,
		SCJOA,
		SCCRI,
		SCBLU,
		SCLAG,
		SCTUB,
		SCITA,
		SCJAR,
		SCSMO,
		SCCAC,
		SCCON,
		SCRSL,
		SCMFA,
		SCBQE,
		SCLGA,
	],
	varas: [SCBLU05, SCCRI02, SCFLP09, SCJOI05],
};

// Art. 2º Res. 86
export const G: Grupo = {
	competencia: Competencia.PREVIDENCIARIA,
	subsecoes: [SCJAR, SCJOI, SCMFA],
	varas: [SCJAR02, SCJOI03, SCJOI04, SCMFA01],
};

// Art. 7º
export const H: Grupo = {
	competencia: Competencia.PREVIDENCIARIA,
	subsecoes: [SCBLU, SCBQE, SCITA, SCRSL],
	varas: [SCBLU03, SCBLU04, SCBQE01, SCITA04, SCRSL01],
};

// Art. 8º
export const I: Grupo = {
	competencia: Competencia.PREVIDENCIARIA,
	subsecoes: [SCCRI, SCCAC, SCFLP, SCJOA, SCLAG, SCLGA, SCTUB],
	varas: [SCCRI03, SCCAC01, SCFLP05, SCFLP08, SCJOA01, SCLAG02, SCLGA01, SCTUB02],
};

// Art. 9º
export const J: Grupo = {
	competencia: Competencia.PREVIDENCIARIA,
	subsecoes: [SCCHA, SCCON, SCSMO],
	varas: [SCCHA03, SCCON01, SCSMO01],
};

// Art. 10
export const K: Grupo = {
	competencia: Competencia.CIVEL,
	subsecoes: [SCBLU, SCITA, SCJAR, SCJOI],
	varas: [SCBLU01, SCBLU02, SCITA02, SCITA03, SCJAR01, SCJOI02, SCJOI06],
};

// Art. 11
export const L: Grupo = {
	competencia: Competencia.CIVEL,
	subsecoes: [SCCHA, SCCRI, SCFLP, SCLAG, SCTUB],
	varas: [SCCHA02, SCCRI04, SCFLP02, SCFLP03, SCFLP04, SCFLP06, SCLAG01, SCTUB01],
};
