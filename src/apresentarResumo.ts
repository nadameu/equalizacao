import { Juizo } from './Juizo';
import { sequence1Objs, transpose } from './sequence';
import { calcularVariacaoCom, calcularVariacoesCom, showPorcentagem, sum } from './utils';

export function apresentarResumo(juizos: Juizo[], distribuicoes: Distribuicao[][]) {
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
			recebidos: sum(recebidos),
			remetidos: sum(remetidos),
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
		.map(
			({
				juizo,
				tendencia,
				variacao,
				amortizacao,
				distribuidos,
				recebidos,
				remetidos,
				ajustados,
			}) => ({
				sigla: juizo.sigla,
				tendencia: showPorcentagem(tendencia),
				distribuidos,
				recebidos,
				remetidos,
				ajustados,
				variacao: showPorcentagem(variacao),
				amortizacao: showPorcentagem(amortizacao),
			}),
		);
	console.table(
		resumo.reduce((acc, { sigla, ...resto }) => Object.assign(acc, { [sigla]: resto }), {}),
	);
	const variacaoTendencia = calcularVariacaoCom(juizos, x => x.media);
	console.log('Variação tendência', showPorcentagem(variacaoTendencia, true));
	const variacaoAjustados = calcularVariacaoCom(resumo0, x => x.ajustados);
	console.log('Variação ajustados', showPorcentagem(variacaoAjustados, true));
	console.log('Amortização', showPorcentagem(variacaoAjustados / variacaoTendencia - 1));
}
