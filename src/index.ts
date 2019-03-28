import * as fs from 'fs';
import dados from '../dados/distribuicaoreal1718';
import { I as grupoI } from '../dados/grupos';
import * as subsecoes from '../dados/subsecoes';
import { fromDados } from './Ajuizamento';
import { algoritmoV3 } from './algoritmoV3';
import { show } from './Competencia';
import { distribuicaoPorSorteio } from './distribuicaoPorSorteio';
import './Object';

function valueToString(x: string | number | { sigla: string }): string {
	if (typeof x === 'string') return `"${x}"`;
	if (typeof x === 'number') return `"${show(x)}"`;
	return `"${x.sigla}"`;
}

const ajuizamentos = fromDados(dados, subsecoes);
const distribuicoes = distribuicaoPorSorteio(ajuizamentos);
const redistribuicoes = algoritmoV3(distribuicoes, grupoI);
fs.writeFileSync(
	'result.csv',
	[
		[
			'Processo',
			'Mês',
			'Competência',
			'Subseção de origem',
			'Vara de origem',
			'Juízo de origem',
			'Subseção de destino',
			'Vara de destino',
			'Juízo de destino',
		]
			.map(x => `"${x}"`)
			.join(';'),
	]
		.concat(
			Array.from(redistribuicoes).map(redist =>
				[
					redist.numeroProcesso,
					redist.mes,
					redist.competencia,
					redist.subsecao,
					redist.origem.vara,
					redist.origem,
					redist.destino.vara.subsecao,
					redist.destino.vara,
					redist.destino,
				]
					.map(valueToString)
					.join(';'),
			),
		)
		.join('\n'),
);
