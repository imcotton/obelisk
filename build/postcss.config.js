
module.exports = {
    plugins: [
        require('autoprefixer')({
            browsers: [
                'last 2 versions',
                'ie >= 9',
                'iOS >= 8',
                'Safari >= 8',
            ],
        }),

        require('postcss-nesting')({
        }),
    ],
};
