import assert from 'assert';
export const range = length => Array.from({ length }, (_, i) => i);
/**
 * @param {number} x
 */
export const showPorcentagem = (x, plusMinus = false) => {
	const sign = plusMinus ? '±' : x < 0 ? '-' : '+';
	const simplificado = (Math.round(Math.abs(x) * 10000) / 100).toString();
	const partes = `${simplificado}.`.split('.').slice(0, 2);
	const inteiros = partes[0];
	let centesimos = partes[1];
	while (centesimos.length < 2) centesimos += '0';
	return `${' '.repeat(Math.max(0, '100'.length - inteiros.length))}${sign}${[
		inteiros,
		centesimos,
	].join(',')}%`;
};
const regexpPorcentagem = /^\s*([+-])(\d+),(\d{2})%$/;
/**
 * @param {string} x
 */
export const parsePorcentagem = x => {
	const partes = regexpPorcentagem.exec(x);
	assert.ok(partes !== null, `"${x}" não é um valor de porcentagem reconhecido.`);
	const [sign, inteiros, centesimos] = partes
		.map((x, i) => {
			switch (i) {
				case 1:
					return x === '-' ? -1 : 1;

				case 2:
				case 3:
					return Number(x);

				case 0:
				default:
					return null;
			}
		})
		.filter(x => x !== null);
	return sign * (inteiros * 0.01 + centesimos * 0.0001);
};

/**
 * @template T
 * @param {T[]} xs
 * @param {(_:T)=>number} f
 */
export const calcularMediaCom = (xs, f) => sum(xs.map(f)) / xs.length;

/**
 * @param {number[]} xs
 */
export const calcularMedia = xs => calcularMediaCom(xs, x => x);

/**
 * @param {number[]} xs
 * @return {number}
 */
export const sum = xs => xs.reduce((acc, x) => acc + x, 0);

/**
 * @template T
 * @param {T[]} xs
 * @param {(_:T)=>number} f
 */
export const calcularVarianciasCom = (xs, f) => {
	const ys = xs.map(f);
	const media = calcularMedia(ys);
	return ys.map(y => Math.pow(y - media, 2));
};

/**
 * @param {number[]} xs
 */
export const calcularVariancias = xs => calcularVarianciasCom(xs, x => x);

/**
 * @template T
 * @param {T[]} xs
 * @param {(_:T)=>number} f
 */
export const calcularVarianciaCom = (xs, f) => calcularMedia(calcularVarianciasCom(xs, f));

/**
 * @param {number[]} xs
 */
export const calcularVariancia = xs => calcularVarianciaCom(xs, x => x);

/**
 * @template T
 * @param {T[]} xs
 * @param {(_:T)=>number} f
 */
export const calcularDesviosCom = (xs, f) => calcularVarianciasCom(xs, f).map(Math.sqrt);

/**
 * @param {number[]} xs
 */
export const calcularDesvios = xs => calcularDesviosCom(xs, x => x);

/**
 * @template T
 * @param {T[]} xs
 * @param {(_:T)=>number} f
 */
export const calcularDesvioPadraoCom = (xs, f) => Math.sqrt(calcularVarianciaCom(xs, f));

/**
 * @param {number[]} xs
 */
export const calcularDesvioPadrao = xs => calcularDesvioPadraoCom(xs, x => x);

/**
 * @template T
 * @param {T[]} xs
 * @param {(_:T)=>number} f
 */
export const calcularVariacaoCom = (xs, f) => {
	const ys = xs.map(f);
	return calcularDesvioPadrao(ys) / calcularMedia(ys);
};

/**
 * @param {number[]} xs
 */
export const calcularVariacao = xs => calcularVariacaoCom(xs, x => x);

/**
 * @template T
 * @param {T[]} xs
 * @param {(_:T)=>number} f
 */
export const calcularVariacoesCom = (xs, f) => {
	const ys = xs.map(f);
	const media = calcularMedia(ys);
	return ys.map(y => y / media - 1);
};

/**
 * @param {number[]} xs
 */
export const calcularVariacoes = xs => calcularVariacoesCom(xs, x => x);
