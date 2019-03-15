import { Juizo } from './Juizo';
const range = length => Array.from({ length }, (_, i) => i);

const juizos = [
	'SCCRI03',
	'SCLAG02',
	'SCLGA01',
	'SCFLP05',
	'SCFLP08',
	'SCTUB02',
	'SCCAC01',
	'SCJOA01',
]
	.sort()
	.map(sigla => new Juizo(sigla));
const mandou = juizos.map(() => true);
const contadores = juizos.map(() => 0);
const distribuicoes = range(13).map(mes => {
	const aDistribuir = juizos.map(x => x.definirQtdDistribuicao());
	const aDistribuirOriginal = aDistribuir.slice();
	const distribuidos = juizos.map(() => 0);
	const remetidos = juizos.map(() => 0);
	const recebidos = juizos.map(() => 0);
	while (aDistribuir.some(processos => processos > 0)) {
		const distribuirPara = Math.floor(aDistribuir.length * Math.random());
		if (aDistribuir[distribuirPara] === 0) continue; // Não tem mais iniciais
		let redistribuir = false;
		let redistribuirPara = undefined;
		if (contadores[distribuirPara] > 0) {
			// Tem crédito do mês anterior
			if (mandou[distribuirPara]) {
				// Última inicial foi redistribuída
				redistribuir = false;
				mandou[distribuirPara] = false; // Zera para que a próxima possa ser redistribuída
			} else {
				// Talvez mandar para outro Juízo
				const juizosAptosAReceber = contadores.reduce(
					(acc, x, i) => (i !== distribuirPara && x < 0 ? acc.concat([i]) : acc),
					[],
				);
				if (juizosAptosAReceber.length > 0) {
					redistribuir = true;
					redistribuirPara =
						juizosAptosAReceber[Math.floor(juizosAptosAReceber.length * Math.random())];
				} else {
					redistribuir = false;
				}
			}
		}
		distribuidos[distribuirPara]++;
		aDistribuir[distribuirPara]--;
		if (mes > 3) {
			if (redistribuir) {
				contadores[distribuirPara]--;
				remetidos[distribuirPara]++;
				mandou[distribuirPara] = true;
				contadores[redistribuirPara]++;
				recebidos[redistribuirPara]++;
			}
		}
	}
	const ajustados = juizos.map((_, i) => distribuidos[i] + recebidos[i] - remetidos[i]);
	const media = Math.round(ajustados.reduce((acc, x) => acc + x, 0) / ajustados.length);
	ajustados.forEach((processos, i) => {
		contadores[i] += processos - media;
	});
	return juizos.map((juizo, i) => ({
		sigla: juizo.sigla,
		'a distribuir': aDistribuirOriginal[i],
		distribuidos: distribuidos[i],
		redistribuidos: recebidos[i] - remetidos[i],
		ajustados: ajustados[i],
		contador: contadores[i],
	}));
});

distribuicoes.forEach((d, i) => {
	const dt = new Date(2018, 11 + i, 1);
	let mes = (dt.getMonth() + 1).toString();
	while (mes.length < 2) {
		mes = `0${mes}`;
	}
	console.log(`${mes}/${dt.getFullYear()}`);
	console.table(d.reduce((acc, { sigla, ...resto }) => Object.assign(acc, { [sigla]: resto }), {}));
});
console.log('Resumo');
let resumo = distribuicoes
	.reduce(
		(acc, mes) =>
			mes.reduce((acc2, { ajustados }, j) => {
				acc2[j].ajustados += ajustados;
				return acc2;
			}, acc),
		juizos.map(j => ({ sigla: j.sigla, ajustados: 0 })),
	)
	.map(({ sigla, ajustados }) => ({
		sigla,
		ajustados,
		'processos por mês': Math.round((ajustados / distribuicoes.length) * 100) / 100,
	}));
const mediaResumo = resumo.reduce((acc, { ajustados }) => acc + ajustados, 0) / resumo.length;
const mediaTendencia = juizos.reduce((acc, x) => acc + x.media, 0) / juizos.length;
resumo = resumo.map(({ sigla, ajustados, ...resto }, i) => ({
	sigla,
	tendencia: `${juizos[i].media >= mediaTendencia ? '+' : ''}${Math.round(
		(juizos[i].media / mediaTendencia - 1) * 10000,
	) / 100}%`,
	ajustados,
	...resto,
	variancia: `${ajustados >= mediaResumo ? '+' : ''}${Math.round(
		(ajustados / mediaResumo - 1) * 10000,
	) / 100}%`,
}));
console.table(
	resumo
		.sort((a, b) => a.ajustados - b.ajustados)
		.reduce((acc, { sigla, ...resto }) => Object.assign(acc, { [sigla]: resto }), {}),
);
