import * as fs from 'fs';
import dados from '../dados/distribuicaoreal1718';
import { fromDados } from './Ajuizamento';
import { distribuicaoPorSorteio } from './distribuicaoPorSorteio';
import { Distribuicao } from './Distribuicao';

function distValueToString(x: Distribuicao[keyof Distribuicao]): string {
	if (typeof x === 'string') return `"${x}"`;
	if (typeof x === 'number') return `${x}`;
	return `"${x.sigla}"`;
}

const ajuizamentos = fromDados(dados);
const distribuicoes = distribuicaoPorSorteio(ajuizamentos);
fs.writeFileSync(
	'result.csv',
	['"Processo";"Mês";"Subseção";"Competência";"Juízo"']
		.concat(
			Array.from(distribuicoes).map(distribuicao =>
				Object.values(distribuicao)
					.map(distValueToString)
					.join(';'),
			),
		)
		.join('\n'),
);
