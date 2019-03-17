import { sortearDistNormal } from './sortearDistNormal';

const MEDIA_GERAL = 270;
const DESVIO_GERAL = 30;

let criados = 0;
const gerarSigla = () => {
	criados++;
	return `Juízo ${String.fromCharCode(64 + criados)}`;
};
const gerarMedia = () => sortearDistNormal(MEDIA_GERAL, DESVIO_GERAL);
const gerarDesvio = (media: number) => media / 9;

export class Juizo {
	sigla: string;
	media: number;
	desvio: number;
	distribuicoes: Map<number, number>;
	constructor({
		sigla = gerarSigla(),
		media = gerarMedia(),
		desvio = gerarDesvio(media),
		distribuicoes = new Map<number, number>(),
	}: {
		sigla?: string;
		media?: number;
		desvio?: number;
		/** Primeiro número corresponde ao valor de .getTime() do mês, convertido para horas. */
		distribuicoes?: Map<number, number>;
	} = {}) {
		this.sigla = sigla;
		this.media = media;
		this.desvio = desvio;
		this.distribuicoes = distribuicoes;
	}

	definirQtdDistribuicao() {
		let num = -1;
		while (num < 0) num = Math.round(sortearDistNormal(this.media, this.desvio));
		return num;
	}
}
