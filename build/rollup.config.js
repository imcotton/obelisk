
export default {
    input: 'dist/script/app.js',
    output: {
        file: 'dist/script/bundle.js',
        format: 'iife',
        name: 'main',
        globals: {
            window: 'window',
            jquery: 'null',
        },
    },
    context: 'window',
    plugins: [

        require('rollup-plugin-commonjs')(),

        require('rollup-plugin-node-resolve')({
            jsnext: true,
            browser: true,
        }),

        require('rollup-plugin-inject')({
            exclude: 'node_modules/**',
            modules: {
                window: 'window',
            }
        }),

        {
            transformBundle (source = '') {
                return source
                    .replace(/^(\(function \(window),\$,Rx/, '$1')
                    .replace(/window ?= ?'default'/, '//')
                    .replace(/\$ ?= ?'default'/, '//')
                ;
            },
        },

        require('rollup-plugin-cleanup')({
            comments: 'none',
        }),
    ],
    external: [
        'window',
        'jquery',
    ],
};
