import assert from 'assert';
export const range = length => Array.from({ length }, (_, i) => i);
export const showPorcentagem = x => {
	const sign = x < 0 ? '-' : '+';
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
