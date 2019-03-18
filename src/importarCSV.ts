import * as fs from 'fs';
import * as path from 'path';
import * as subsecoes from '../dados/subsecoes';

enum FakeCompetencia {
	CRIMINAL = 'Competencia.CRIMINAL',
	EXECUCAO_FISCAL = 'Competencia.EXECUCAO_FISCAL',
	PREVIDENCIARIA = 'Competencia.PREVIDENCIARIA',
	CIVEL = 'Competencia.CIVEL',
}

const SUBSECOES = Object.values(subsecoes).reduce<string[]>((acc, { cod, sigla }) => {
	acc[cod] = sigla;
	return acc;
}, []);

const competencias: [FakeCompetencia, string][] = [
	[FakeCompetencia.CRIMINAL, 'realcriminal1718'],
	[FakeCompetencia.EXECUCAO_FISCAL, 'realef1718'],
	[FakeCompetencia.PREVIDENCIARIA, 'realprev1718'],
	[FakeCompetencia.CIVEL, 'realcivel1718'],
];

const distribuicoes: [string, string, FakeCompetencia, number][] = [];
for (const [competencia, arquivo] of competencias) {
	const dadosCompetenciaAtual = fs
		.readFileSync(path.resolve('dados', `${arquivo}.csv`), 'utf8')
		.split('\n')
		.map(line => line.split(';'))
		.map(([juizo, distribuidos]) => {
			const match = /^Total (\d{2}) - .* (\d{2}\/\d{4}) e-ProcV2$/.exec(juizo);
			if (match === null) return null;
			if (distribuidos === '0') return null;
			const [cod, mes] = match.slice(1);
			return [mes, SUBSECOES[Number(cod)], competencia, Number(distribuidos)] as [
				string,
				string,
				FakeCompetencia,
				number
			];
		})
		.filter((x): x is [string, string, FakeCompetencia, number] => x !== null);
	distribuicoes.push.apply(distribuicoes, dadosCompetenciaAtual);
}
fs.writeFileSync(
	path.resolve('dados', `distribuicaoreal1718.ts`),
	`import { Competencia } from '../src/Competencia';\n\nexport default ${JSON.stringify(
		distribuicoes,
	).replace(/"(Competencia\.[^"]+)"/g, '$1')} as [string, string, Competencia, number][];`,
);
