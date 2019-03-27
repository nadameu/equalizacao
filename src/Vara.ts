import { Competencia } from './Competencia';
import { Subsecao } from './Subsecao';

export interface Vara {
	sigla: string;
	subsecao: Subsecao;
	competencia: Competencia;
}
