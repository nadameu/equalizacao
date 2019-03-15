const pkg = require('./package.json');
import babel from 'rollup-plugin-babel';

export default {
	input: pkg.main,
	output: {
		format: 'cjs',
		file: 'dist/bundle.js',
	},
	external: ['brain.js'],
	plugins: [
		babel({
			exclude: 'node_modules/**',
		}),
	],
};
