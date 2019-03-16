import { Juizo } from './Juizo';
import { sequence1Objs, transpose } from './sequence';
import {
	calcularMediaCom,
	calcularVariacaoCom,
	calcularVariacoesCom,
	parsePorcentagem,
	range,
	showPorcentagem,
	sum,
} from './utils';

const JUIZOS = 8;
const MESES = 6;

const juizos = range(JUIZOS)
	.map(() => new Juizo(''))
	.sort((a, b) => b.media - a.media)
	.map((juizo, i) => ((juizo.sigla = `Juízo ${String.fromCharCode(65 + i)}`), juizo));
const mandou = juizos.map(() => true);
const contadores = juizos.map(() => 0);
const distribuicoes = range(MESES).map(mes => {
	const contadoresOriginal = contadores.slice();
	const aDistribuir = juizos.map(x => x.definirQtdDistribuicao());
	const aDistribuirOriginal = aDistribuir.slice();
	const distribuidos = juizos.map(() => 0);
	const remetidos = juizos.map(() => 0);
	const recebidos = juizos.map(() => 0);
	while (aDistribuir.some(processos => processos > 0)) {
		const distribuirPara = Math.floor(aDistribuir.length * Math.random());
		if (aDistribuir[distribuirPara] === 0) continue; // Não tem mais iniciais
		let redistribuirPara: null | number = null;
		if (contadores[distribuirPara] > 0) {
			// Tem crédito do mês anterior
			if (mandou[distribuirPara]) {
				// Última inicial foi redistribuída
				redistribuirPara = null;
				mandou[distribuirPara] = false; // Zera para que a próxima possa ser redistribuída
			} else {
				// Talvez mandar para outro Juízo
				const juizosAptosAReceber = contadores.reduce<number[]>(
					(acc, x, i) => (i !== distribuirPara && x < 0 ? acc.concat([i]) : acc),
					[],
				);
				if (juizosAptosAReceber.length > 0) {
					redistribuirPara =
						juizosAptosAReceber[Math.floor(juizosAptosAReceber.length * Math.random())];
				} else {
					redistribuirPara = null;
				}
			}
		}
		distribuidos[distribuirPara]++;
		aDistribuir[distribuirPara]--;
		if (mes > 3) {
			if (redistribuirPara !== null) {
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
	const informacoes = {
		'contador antes': contadoresOriginal,
		'a distribuir': aDistribuirOriginal,
		distribuidos,
		recebidos,
		remetidos,
		ajustados,
		'contador depois': contadores,
	};
	return juizos.map((juizo, i) => ({
		juizo,
		...(Object.keys(informacoes).reduce(
			(acc, key) => Object.assign(acc, { [key]: informacoes[key as keyof typeof informacoes][i] }),
			{},
		) as { [k in keyof typeof informacoes]: (typeof informacoes)[k][number] }),
	}));
});

distribuicoes.forEach((d, i) => {
	const dt = new Date(2018, 11 + i, 1);
	let mes = (dt.getMonth() + 1).toString();
	while (mes.length < 2) {
		mes = `0${mes}`;
	}
	console.log(`${mes}/${dt.getFullYear()}`);
	console.table(
		d.reduce((acc, { juizo, ...resto }) => Object.assign(acc, { [juizo.sigla]: resto }), {}),
	);
});
console.log('Resumo');
const tendencias = calcularVariacoesCom(juizos, x => x.media);
const resumo0 = transpose(distribuicoes)
	.map(sequence1Objs)
	.map(({ juizo, distribuidos, recebidos, remetidos, ajustados }, i) => ({
		juizo: juizo[0],
		tendencia: tendencias[i],
		distribuidos: sum(distribuidos),
		redistribuidos: sum(recebidos) - sum(remetidos),
		ajustados: sum(ajustados),
	}));
const variacoes = calcularVariacoesCom(resumo0, x => x.ajustados);
const resumo = resumo0
	.map(({ juizo, tendencia, ...resto }, i) => ({
		juizo,
		tendencia,
		...resto,
		variacao: variacoes[i],
		amortizacao: variacoes[i] / tendencia - 1,
	}))
	.map(({ juizo, tendencia, variacao, amortizacao, distribuidos, redistribuidos, ajustados }) => ({
		sigla: juizo.sigla,
		tendencia: showPorcentagem(tendencia),
		distribuidos,
		redistribuidos,
		ajustados,
		variacao: showPorcentagem(variacao),
		amortizacao: showPorcentagem(amortizacao),
	}));
console.table(
	resumo.reduce((acc, { sigla, ...resto }) => Object.assign(acc, { [sigla]: resto }), {}),
);
console.log('Variação tendência', showPorcentagem(calcularVariacaoCom(juizos, x => x.media), true));
console.log(
	'Variação ajustados',
	showPorcentagem(calcularVariacaoCom(resumo0, x => x.ajustados), true),
);
console.log(
	'Média amortização',
	showPorcentagem(calcularMediaCom(resumo, x => parsePorcentagem(x.amortizacao))),
);
