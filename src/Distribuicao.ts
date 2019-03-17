import { Juizo } from "./Juizo";

export interface Distribuicao {
	'contador antes': number;
	'a distribuir': number;
	distribuidos: number;
	recebidos: number;
	remetidos: number;
	ajustados: number;
	'contador depois': number;
	juizo: Juizo;
}
