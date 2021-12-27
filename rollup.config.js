import json from '@rollup/plugin-json'
import copy from 'rollup-plugin-copy'
import replace from '@rollup/plugin-replace'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import html from 'rollup-plugin-html'
import css from 'rollup-plugin-import-css'
import typescript from '@rollup/plugin-typescript'
import sourcemaps from 'rollup-plugin-sourcemaps'
import del from 'rollup-plugin-delete'

export default {
	input: 'src/index.ts',
	output: {
		sourcemap: true,
		dir: 'dist',
		entryFileNames: 'bundle.js',
		format: 'cjs'
	},
	plugins: [
		// babel(),
		css(),
		html({ include: '**/*.html' }),
		json(),
		copy({
			targets: [
				{ src: 'index_dist.html', dest: 'dist', rename: 'index.html' },
				{ src: 'favicon.ico', dest: 'dist' },
				{ src: 'assets', dest: 'dist' }
			]
		}),
		resolve(),
		commonjs(),
		typescript(),
		del({ targets: ['dist/*'] })
	]
}
