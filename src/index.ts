import './Object';
import { map as mapObj } from './Obj';
import * as fs from 'fs';
import dados from '../dados/distribuicaoreal1718';
import { I as grupoI } from '../dados/grupos';
import * as subsecoes from '../dados/subsecoes';
import { fromDados } from './Ajuizamento';
import { algoritmoV4 } from './algoritmoV4';
import { show, Competencia } from './Competencia';
import { distribuicaoPorSorteio } from './distribuicaoPorSorteio';
import { toMap } from './Array';
import { map, toEntriesArray } from './Map';
import { sum } from './utils';
import { K } from './K';
import * as Obj from './Obj';

function valueToString(x: string | number | { sigla: string }): string {
	if (typeof x === 'string') return `"${x}"`;
	if (typeof x === 'number') return `"${show(x)}"`;
	return `"${x.sigla}"`;
}

const ajuizamentos = fromDados(dados, subsecoes);
const distribuicoes = distribuicaoPorSorteio(ajuizamentos);
const redistribuicoes = algoritmoV4(distribuicoes, grupoI);
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
const resultado: Record<string, Record<string, number>> = {};
const resumo: Record<
	string,
	Record<'ajuizados' | 'ficaram' | 'remetidos' | 'recebidos' | 'saldo', number>
> = {};
for (let iter = 1; iter <= 10; iter++) {
	console.log(`Iteração`, iter);
	for (const { competencia, origem, destino } of redistribuicoes) {
		const siglaOrigem = origem.vara.sigla;
		const siglaDestino = destino.vara.sigla;
		const valorK = competencia === Competencia.CIVEL ? K : 1;

		// resultado
		const resOrigem = resultado[siglaOrigem] || (resultado[siglaOrigem] = {});
		resOrigem[siglaDestino] = (resOrigem[siglaDestino] || 0) + valorK;

		const resumoOrigem =
			resumo[siglaOrigem] ||
			(resumo[siglaOrigem] = {
				ajuizados: 0,
				ficaram: 0,
				remetidos: 0,
				recebidos: 0,
				saldo: 0,
			});
		const resumoDestino =
			resumo[siglaDestino] ||
			(resumo[siglaDestino] = {
				ajuizados: 0,
				ficaram: 0,
				remetidos: 0,
				recebidos: 0,
				saldo: 0,
			});

		resumoOrigem.ajuizados += valorK;
		if (destino.sigla === origem.sigla) {
			resumoOrigem.ficaram += valorK;
		} else {
			resumoOrigem.remetidos -= valorK;
			resumoDestino.recebidos += valorK;
		}
		resumoOrigem.saldo = resumoOrigem.ficaram + resumoOrigem.recebidos;
		resumoDestino.saldo = resumoDestino.ficaram + resumoDestino.recebidos;
	}
	console.log('origem \\ destino');
	console.table(resultado.do(Obj.map(Obj.map(Math.round))));
	console.log('resumo');
	console.table(resumo.do(Obj.map(Obj.map(Math.round))));
}
