import { Ajuizamento } from './Ajuizamento';
import { Juizo } from './Juizo';

export interface Distribuicao extends Ajuizamento {
	juizo: Juizo;
}
