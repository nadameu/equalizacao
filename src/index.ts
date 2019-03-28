import './Object';
import * as fs from 'fs';
import dados from '../dados/distribuicaoreal1718';
import { I as grupoI } from '../dados/grupos';
import { fromDados } from './Ajuizamento';
import { algoritmoV3 } from './algoritmoV3';
import { show } from './Competencia';
import { distribuicaoPorSorteio } from './distribuicaoPorSorteio';

function valueToString(x: string | number | { sigla: string }): string {
	if (typeof x === 'string') return `"${x}"`;
	if (typeof x === 'number') return `"${show(x)}"`;
	return `"${x.sigla}"`;
}

const ajuizamentos = fromDados(dados);
const distribuicoes = distribuicaoPorSorteio(ajuizamentos);
const redistribuicoes = algoritmoV3(distribuicoes, grupoI);
fs.writeFileSync(
	'result.csv',
	[
		'"Processo";"Mês";"Competência";"Subseção de origem";"Vara de origem";"Juízo de origem";"Subseção de destino";"Vara de destino";"Juízo de destino"',
	]
		.concat(
			Array.from(redistribuicoes).map(
				({ numeroProcesso, mes, subsecao, competencia, origem, destino }) =>
					Object.values({
						numeroProcesso,
						mes,
						competencia,
						subsecao,
						varaOrigem: origem.vara,
						origem,
						ssDestino: destino.vara.subsecao,
						varaDestino: destino.vara,
						destino,
					})
						.map(valueToString)
						.join(';'),
			),
		)
		.join('\n'),
);
