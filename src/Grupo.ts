import { Competencia } from './Competencia';
import { Vara } from './Vara';
import { Subsecao } from './Subsecao';

export interface Grupo {
	competencia: Competencia;
	subsecoes: Subsecao[];
	varas: Vara[];
}
