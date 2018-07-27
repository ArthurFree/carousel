// import fs from 'fs';
// import path from 'path';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const resolvePath = (...args) => path.resolve(ROOT_DIR, ...args);
const SRC_DIR = resolvePath('src');
const BUILD_DIR = resolvePath('build');

const isDebug = !process.argv.includes('--release');
const isVerbose = process.argv.includes('--verbose');
const isAnalyze = process.argv.includes('--analyze') || process.argv.includes('--analyse');

const reScript = /\.(js|jsx)$/;
const reStyle = /\.(css|less|scss|sass|styl)$/;
const reImage = /\.(bmp|gif|jpg|jpeg|png|svg)$/;

function cssLoader(importLoaders) {
    return {
        importLoaders,
        import: false,
        minimize: false,
        sourceMap: true,
    }
}

function postcssLoader() {
    return {
        ident: 'postcss-loader',
        plugins: [
            require('autoprefixer')(),
        ],
        sourceMap: true,
    }
}

moduel.exports = {
    entry: '../carousel.js',
    output: {
        path: path.resolve(__dirname, '..', 'dist'),
        filename: 'carousel.js',
    },
    module: {
        rules: [
            // js
            {
                test: reScript,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                options: { cacheDirectory: true, },
            },
            // css
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: cssLoader(1),
                    },
                    {
                        loader: 'postcss-loader',
                        options: postcssLoader(),
                    }
                ]
            },
            // less
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: cssLoader(2),
                    },
                    {
                        loader: 'postcss-loader',
                        options: postcssLoader(),
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true,
                            javascriptEnabled: true,
                        },
                    }
                ],
            },
        ],
    },
    resolve: {
        alias: [],
        modules: ['node_modules', 'src'],
    },
    mode: 'none',
    plugins: [],
    bail: !isDebug,
    cache: isDebug,
    stats: {
        hash: isVerbose,
        version: isVerbose,
        timings: true,
        children: false,
        cached: isVerbose,
        cachedAssets: isVerbose,
        errors: false,
        errorDetails: false,
        warnings: false,
        chunks: isVerbose,
        chunkModules: isVerbose,
        modules: isVerbose,
        reasons: isDebug,
        source: false,
        publicPath: false,
    },
    performance: {
        hints: false,
    },
    devtool: isDebug ? 'cheap-module-inline-source-map' : 'source-map',
}
