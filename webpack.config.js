var Config = require('./config.json');
var Webpack = require('webpack');

module.exports = {
    // Entry(points) are like diff endpoints/routes that might load the SPA
    entry: {
        main: './lib/public/js/src/main.js',
        // upload: ''
        // admin: '' 
    },
    output: {
        path: './lib/public/js',
        filename: '[name].js'
    },
    module: {
        loaders: [
            { test: /\.jsx$/, loader: 'jsx-loader' },
            { test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
            { test: /\.css$/, loader: 'style-loader!css-loader'}
        ]
    },
    plugins: []
};