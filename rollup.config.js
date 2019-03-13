const pkg = require('./package.json');
import babel from 'rollup-plugin-babel';

export default {
	input: pkg.main,
	output: {
		format: 'es',
		file: 'dist/bundle.js',
	},
	plugins: [
		babel({
			exclude: 'node_modules/**',
		}),
	],
};
