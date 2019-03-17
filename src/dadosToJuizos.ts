import { calcularDesvioPadrao, calcularMedia } from './utils';
import { Juizo } from './Juizo';

export const dadosToJuizos = (dados: Record<string, [number, number][]>) =>
	Object.entries(dados).map(([sigla, distribuicoes]) => {
		const distribuidos = distribuicoes.map(([_, x]) => x);
		const media = calcularMedia(distribuidos);
		const desvio = calcularDesvioPadrao(distribuidos);
		return new Juizo({ sigla, media, desvio, distribuicoes: new Map(distribuicoes) });
	});
