const MEDIA_GERAL = 200;
const VARIANCIA_GERAL = 100;

export class Juizo {
	sigla: string;
	media: number;
	variancia: number;
	constructor(sigla: string) {
		this.sigla = sigla;
		this.media = MEDIA_GERAL - VARIANCIA_GERAL / 2 + Math.random() * VARIANCIA_GERAL;
		this.variancia = this.media / 2;
	}

	definirQtdDistribuicao() {
		return Math.round(this.media - this.variancia / 2 + Math.random() * this.variancia);
	}
}
