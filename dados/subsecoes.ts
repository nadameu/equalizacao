import { Subsecao } from '../src/Subsecao';
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
	SCFLP09,
} from './varas';

export const SCFLP: Subsecao = {
	cod: 0,
	sigla: 'SCFLP',
	varas: [SCFLP01, SCFLP02, SCFLP03, SCFLP04, SCFLP05, SCFLP06, SCFLP07, SCFLP08, SCFLP09],
};

export const SCJOI: Subsecao = {
	cod: 1,
	sigla: 'SCJOI',
	varas: [SCJOI01, SCJOI02, SCJOI03, SCJOI04, SCJOI05, SCJOI06],
};

export const SCCHA: Subsecao = { cod: 2, sigla: 'SCCHA', varas: [SCCHA01, SCCHA02, SCCHA03] };

export const SCJOA: Subsecao = { cod: 3, sigla: 'SCJOA', varas: [SCJOA01] };

export const SCCRI: Subsecao = {
	cod: 4,
	sigla: 'SCCRI',
	varas: [SCCRI01, SCCRI02, SCCRI03, SCCRI04],
};

export const SCBLU: Subsecao = {
	cod: 5,
	sigla: 'SCBLU',
	varas: [SCBLU01, SCBLU02, SCBLU03, SCBLU04, SCBLU05],
};

export const SCLAG: Subsecao = { cod: 6, sigla: 'SCLAG', varas: [SCLAG01, SCLAG02] };

export const SCTUB: Subsecao = { cod: 7, sigla: 'SCTUB', varas: [SCTUB01, SCTUB02] };

export const SCITA: Subsecao = {
	cod: 8,
	sigla: 'SCITA',
	varas: [SCITA01, SCITA02, SCITA03, SCITA04],
};

export const SCJAR: Subsecao = { cod: 9, sigla: 'SCJAR', varas: [SCJAR01, SCJAR02] };

export const SCSMO: Subsecao = { cod: 10, sigla: 'SCSMO', varas: [SCSMO01] };

export const SCCAC: Subsecao = { cod: 11, sigla: 'SCCAC', varas: [SCCAC01] };

export const SCCON: Subsecao = { cod: 12, sigla: 'SCCON', varas: [SCCON01] };

export const SCRSL: Subsecao = { cod: 13, sigla: 'SCRSL', varas: [SCRSL01] };

export const SCMFA: Subsecao = { cod: 14, sigla: 'SCMFA', varas: [SCMFA01] };

export const SCBQE: Subsecao = { cod: 15, sigla: 'SCBQE', varas: [SCBQE01] };

export const SCLGA: Subsecao = { cod: 16, sigla: 'SCLGA', varas: [SCLGA01] };
