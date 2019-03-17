import { algoritmoV3 } from './algoritmoV3';
import { apresentarResumo } from './apresentarResumo';
import { Juizo } from './Juizo';
import { range } from './utils';

const JUIZOS = 8;
const MESES = 6;

const juizos = range(JUIZOS)
	.map(() => new Juizo())
	.sort((a, b) => b.media - a.media)
	.map((juizo, i) => {
		juizo.sigla = `Juízo ${String.fromCharCode(65 + i)}`;
		return juizo;
	});

const distribuicoes = algoritmoV3(juizos, MESES);

apresentarResumo(juizos, distribuicoes);
