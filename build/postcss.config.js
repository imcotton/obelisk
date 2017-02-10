
module.exports = {
    use: ['autoprefixer', 'postcss-nesting'],
    input: 'source/style/*.css',
    dir: 'dist/style',

    autoprefixer: {
        browsers: [
            'last 2 versions',
            'ie >= 9',
            'iOS >= 8',
            'Safari >= 8',
        ],
    },

    'postcss-nesting': {
    },
};
