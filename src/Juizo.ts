import { Vara } from './Vara';

export interface Juizo {
	sigla: string;
	vara: Vara;
}

export const fromVara = (vara: Vara): Juizo[] =>
	['F', 'S'].map(fs => ({ sigla: `${vara.sigla}${fs}`, vara }));
