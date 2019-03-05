
module.exports = {
    plugins: [
        require('autoprefixer')({
            browsers: [
                'last 2 versions',
                'iOS >= 10',
                'Safari >= 10',
            ],
        }),

        require('postcss-nesting')({
        }),
    ],
};
