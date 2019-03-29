import './Object';
import * as fs from 'fs';
import dados from '../dados/distribuicaoreal1718';
import { I as grupoI } from '../dados/grupos';
import * as subsecoes from '../dados/subsecoes';
import { fromDados } from './Ajuizamento';
import { algoritmoV4 } from './algoritmoV4';
import { Competencia, show } from './Competencia';
import { distribuicaoPorSorteio } from './distribuicaoPorSorteio';
import { K as fatorK } from './K';
import * as Obj from './Obj';
import { calcularMedia, sum } from './utils';

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
const meses = new Set<string>();
for (let iter = 1; iter <= 10; iter++) {
	console.log(`Iteração`, iter);
	for (const { mes, competencia, origem, destino } of redistribuicoes) {
		if (!meses.has(mes)) {
			meses.add(mes);
		}

		const siglaOrigem = origem.vara.sigla;
		const siglaDestino = destino.vara.sigla;
		const valorK = competencia === Competencia.CIVEL ? fatorK : 1;

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
	const qtdMeses = Array.from(meses.values()).length;
	console.log('origem \\ destino');
	console.table(resultado.do(Obj.map(Obj.map(Math.round))).do(Obj.sortByKey));
	console.log(`resumo ${iter * qtdMeses} meses`);
	console.table(resumo.do(Obj.map(Obj.map(Math.round))).do(Obj.sortByKey));
	const saldos = Object.values(resumo).map(({ saldo }) => saldo / iter / qtdMeses);
	const menor = Math.min(...saldos);
	const media = calcularMedia(saldos);
	const maior = Math.max(...saldos);
	console.log(
		`Média: ${media.toLocaleString('pt-BR', {
			maximumFractionDigits: 1,
			useGrouping: false,
		})} ± ${Math.max(maior - media, media - menor).toLocaleString('pt-BR', {
			maximumFractionDigits: 1,
			useGrouping: false,
		})} processos por vara por mês`,
	);
	console.log(
		`Vara com maior distribuição terá ${(maior / menor - 1).toLocaleString('pt-BR', {
			style: 'percent',
			maximumFractionDigits: 1,
		})} mais trabalho que a de menor distribuição`,
	);
	const erros = Object.values(resumo)
		.map(x => x.do(Obj.map(x => x / iter / qtdMeses)))
		.map(({ recebidos, remetidos }) => Math.min(recebidos, -remetidos));
	console.log(
		`Erros: ${sum(erros).toLocaleString('pt-BR', {
			maximumFractionDigits: 1,
			useGrouping: false,
		})} processo(s) por mês que não deveria(m) ser redistribuído(s) no grupo`,
	);
}
