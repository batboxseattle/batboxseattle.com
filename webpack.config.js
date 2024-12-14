const path = require('path');

module.exports = (env, argv) => {
    return {
        entry: './scripts.js',
        output: {
            filename: 'scripts.js',
            path: path.resolve(__dirname, 'dist'),
        },
        mode: argv.mode,
        devServer: {
            static: {
                directory: __dirname,
            },
        },
    };
};