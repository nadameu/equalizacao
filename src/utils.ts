export const range = (length: number) => Array.from({ length }, (_, i) => i);
export const showPorcentagem = (x: number, plusMinus = false) => {
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
export const parsePorcentagem = (x: string) => {
	const partes = regexpPorcentagem.exec(x);
	if (partes === null) {
		throw new Error(`"${x}" não é um valor de porcentagem reconhecido.`);
	}
	const sign = partes[1] === '-' ? -1 : 1;
	const inteiros = Number(partes[2]);
	const centesimos = Number(partes[3]);
	return sign * (inteiros * 0.01 + centesimos * 0.0001);
};

export const sum = (xs: number[]): number => xs.reduce((acc, x) => acc + x, 0);

type CalcularCom = <T>(xs: T[], f: (_: T) => number) => number;
type CalcularComs = <T>(xs: T[], f: (_: T) => number) => number[];
type Calcular = (xs: number[]) => number;
type Calculars = (xs: number[]) => number[];

export const calcularMediaCom: CalcularCom = (xs, f) => sum(xs.map(f)) / xs.length;
export const calcularMedia: Calcular = xs => calcularMediaCom(xs, x => x);

export const calcularVarianciasCom: CalcularComs = (xs, f) => {
	const ys = xs.map(f);
	const media = calcularMedia(ys);
	return ys.map(y => Math.pow(y - media, 2));
};
export const calcularVariancias: Calculars = xs => calcularVarianciasCom(xs, x => x);

export const calcularVarianciaCom: CalcularCom = (xs, f) =>
	calcularMedia(calcularVarianciasCom(xs, f));
export const calcularVariancia: Calcular = xs => calcularVarianciaCom(xs, x => x);

export const calcularDesviosCom: CalcularComs = (xs, f) =>
	calcularVarianciasCom(xs, f).map(Math.sqrt);
export const calcularDesvios: Calculars = xs => calcularDesviosCom(xs, x => x);

export const calcularDesvioPadraoCom: CalcularCom = (xs, f) =>
	Math.sqrt(calcularVarianciaCom(xs, f));
export const calcularDesvioPadrao: Calcular = xs => calcularDesvioPadraoCom(xs, x => x);

export const calcularVariacaoCom: CalcularCom = (xs, f) => {
	const ys = xs.map(f);
	return calcularDesvioPadrao(ys) / calcularMedia(ys);
};
export const calcularVariacao: Calcular = xs => calcularVariacaoCom(xs, x => x);

export const calcularVariacoesCom: CalcularComs = (xs, f) => {
	const ys = xs.map(f);
	const media = calcularMedia(ys);
	return ys.map(y => y / media - 1);
};
export const calcularVariacoes: Calculars = xs => calcularVariacoesCom(xs, x => x);
