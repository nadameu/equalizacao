export const sortearDistNormal = (media: number, desvioPadrao: number) => {
	let soma = 0;
	for (let i = 0; i < 12; i++) {
		soma += Math.random();
	}
	return media + (soma - 6) * desvioPadrao;
};
