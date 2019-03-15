const MEDIA_GERAL = 200;
const VARIANCIA_GERAL = 100;

export class Juizo {
	constructor(sigla) {
		this.sigla = sigla;
		this.media = MEDIA_GERAL - VARIANCIA_GERAL / 2 + Math.random() * VARIANCIA_GERAL;
		this.variancia = this.media / 2;
		this.distribuicao = [];
	}

	definirQtdDistribuicao() {
		return Math.round(this.media - this.variancia / 2 + Math.random() * this.variancia);
	}
}
