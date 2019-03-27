import { Ajuizamento } from './Ajuizamento';
import { Juizo } from './Juizo';

export interface Redistribuicao extends Ajuizamento {
	origem: Juizo;
	destino: Juizo;
}
