import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
	entry: 'src/eqcol.js',
	dest: 'dist/eqcol.js',
	format: 'umd',
	moduleName: 'Eqcol',
	plugins: [
		resolve(),
		commonjs({
			include: 'node_modules/**'
		}),
		babel({
			exclude: 'node_modules/**'
		})
	]
};
