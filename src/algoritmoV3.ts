import { Distribuicao } from './Distribuicao';
import { Juizo } from './Juizo';
import { sortearComPeso } from './sortearComPeso';
import { calcularMedia, range } from './utils';

export function algoritmoV3(juizos: Juizo[], meses: number) {
	const mandou = juizos.map(() => true);
	let contadores = juizos.map(() => 0);
	const distribuicoes: Distribuicao[][] = range(meses).map(mes => {
		const contadoresOriginal = contadores.slice();
		const aDistribuir = juizos.map(x => x.definirQtdDistribuicao());
		const aDistribuirOriginal = aDistribuir.slice();
		const distribuidos = juizos.map(() => 0);
		const remetidos = juizos.map(() => 0);
		const recebidos = juizos.map(() => 0);
		while (aDistribuir.some(processos => processos > 0)) {
			const distribuirPara = sortearComPeso(aDistribuir);
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
					try {
						redistribuirPara = sortearComPeso(contadores.map(x => (x < 0 ? 1 : 0)));
					} catch (_) {
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
		const media = calcularMedia(distribuidos);
		contadores = contadores.map((contador, i) => contador + Math.round(distribuidos[i] - media));
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
				(acc, key) =>
					Object.assign(acc, { [key]: informacoes[key as keyof typeof informacoes][i] }),
				{},
			) as { [k in keyof typeof informacoes]: (typeof informacoes)[k][number] }),
		}));
	});
	return distribuicoes;
}
