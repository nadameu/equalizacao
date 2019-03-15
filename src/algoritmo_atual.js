import { Juizo } from './Juizo';
const range = length => Array.from({ length }, (_, i) => i);

const juizos = ['CRI', 'LAG', 'LGA', 'TUB'].map(sigla => new Juizo(sigla));
const mandou = juizos.map(() => false);
const contadores = juizos.map(() => 0);
const distribuicoes = range(60).map(mes => {
	const aDistribuir = juizos.map(x => x.definirQtdDistribuicao());
	const distribuidos = juizos.map(() => 0);
	while (aDistribuir.some(processos => processos > 0)) {
		const distribuirPara = Math.floor(aDistribuir.length * Math.random());
		if (aDistribuir[distribuirPara] === 0) continue; // Não tem mais iniciais
		let redistribuir = undefined;
		let redistribuirPara = undefined;
		if (contadores[distribuirPara] > 0) {
			// Tem crédito do mês anterior
			if (mandou[distribuirPara]) {
				// Última inicial foi redistribuída
				mandou[distribuirPara] = false; // Zera para que a próxima possa ser redistribuída
				redistribuir = false;
			} else {
				// Talvez mandar para outro Juízo
				const juizosAptosAReceber = contadores.reduce(
					(acc, x, i) => (x < 0 ? acc.concat([i]) : acc),
					[],
				);
				if (juizosAptosAReceber.length > 0) {
					redistribuir = true;
					redistribuirPara = Math.floor(juizosAptosAReceber.length * Math.random());
				} else {
					redistribuir = false;
				}
			}
		}
		if (redistribuir) {
			contadores[distribuirPara]--;
			distribuidos[redistribuirPara]++;
			contadores[redistribuirPara]++;
		} else {
			distribuidos[distribuirPara]++;
		}
		aDistribuir[distribuirPara]--;
	}
	const media = distribuidos.reduce((acc, x) => acc + x, 0) / juizos.length;
	distribuidos.forEach((processos, i) => {
		contadores[i] += processos - media;
	});
	return distribuidos.map((processos, i) => ({
		sigla: juizos[i].sigla,
		distribuidos: processos,
		contador: contadores[i],
	}));
});

distribuicoes.forEach((d, i) => {
	console.log(`Mês ${i}`);
	console.table(d);
});
console.log('Resumo');
console.table(
	distribuicoes.reduce(
		(acc, mes) =>
			mes.reduce((acc2, { distribuidos }, j) => {
				acc2[j].distribuidos += distribuidos;
				return acc2;
			}, acc),
		juizos.map(j => ({ sigla: j.sigla, distribuidos: 0 })),
	),
);
