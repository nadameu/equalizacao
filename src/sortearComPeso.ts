import { sum } from './utils';

export const sortearComPeso = (pesos: number[]): number => {
	const soma = sum(pesos);
	let rand = Math.random() * soma;
	for (let i = 0; i < pesos.length; i++) {
		const peso = pesos[i];
		if (rand < peso) return i;
		rand -= peso;
	}
	console.log(pesos);
	throw new Error('Não foi possível sortear.');
};
