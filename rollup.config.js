// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('./package.json');
import typescript from 'rollup-plugin-typescript';

export default {
	input: pkg.main,
	output: {
		format: 'cjs',
		file: 'dist/bundle.js',
	},
	external: ['brain.js'],
	plugins: [typescript()],
};
