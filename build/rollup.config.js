
export default {
    entry: 'dist/script/app.js',
    dest: 'dist/script/bundle.js',
    format: 'iife',
    context: 'window',
    plugins: [
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
        'rxjs',
    ],
    globals: {
        window: 'window',
        jquery: 'null',
        rxjs: 'null',
    },
};
