'use strict';

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

/**@type {import('webpack').Configuration}*/
const config = {
    target: 'node',

    entry: path.resolve(__dirname, 'src/higraphedit-extension.ts'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'higraphedit-extension.js',
        libraryTarget: 'commonjs2'
    },
    devtool: 'source-map',
    externals: {
        vscode: 'commonjs vscode'
    },
    mode: 'development',
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '..', 'webview', 'dist')
                },
                {
                    from: path.resolve(__dirname, '..', '..', 'higraphEdit-server', 'lib')
                }
            ]
        })
    ],
    ignoreWarnings: [/Can't resolve .* in '.*ws\/lib'/],
    performance: {
        hints: false
    }
};

module.exports = config;
