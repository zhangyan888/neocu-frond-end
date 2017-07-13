'use strict';
const ExtractTextPlugin = require('extract-text-webpack-plugin');

let webpack = require('webpack');
const fs = require('fs');
const path = require('path');

const autoprefixer = require('autoprefixer');

let isDev = process.env.NEO_ENV === 'dev';

const pages = fs.readdirSync(path.resolve('./src/pages'));
const entry = {};
for (let i = 0; i < pages.length; i += 1) {
  entry[`dist/${pages[i]}/${pages[i]}`] = `./src/pages/${pages[i]}`;
}

//webpack 插件
let plugins = [
  new ExtractTextPlugin(`[name].css`),
];
if (!isDev) {
  plugins.push( new webpack.optimize.UglifyJsPlugin({
    minimize: !isDev,
    compress: {
      warnings: false,
    }
  }));
}

module.exports = {
  entry,
  output: {
    path: './',
    filename: `[name].js`,
  },
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      include: [
        path.resolve(__dirname, 'src'),
      ],
      query: {
        // plugins: ['transform-runtime'],
        presets: ['es2015', 'stage-0', 'react'],
      },
      exclude: [
        path.resolve(__dirname, 'node_modules'),
      ],
    },
    {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'postcss-loader'),
    },
    {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!less-loader'),
    },
    {
        test: /\.(gif|png|jpg)$/,
        loader: 'url-loader?limit=8192&name=./images/[hash].[ext]'
    },
    {
      test: /\.(woff|woff2|eot|ttf|svg)$/,
      loader: 'url-loader?limit=100000',
    },
    /*{
      test: /.*\.(gif|png|jpe?g|svg)$/i,
      loaders: [
        'file?hash=sha512&digest=hex&name=[hash].[ext]',
        'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}',
      ],
    }*/],
  },
  postcss: [autoprefixer({ browsers: ['ie > 9', 'last 2 versions'] })],
  plugins,
  resolve: {
    extensions: ['', '.js', 'jsx', 'less'],
  },
  externals: {
    react: 'let React',
    'react-dom': 'let ReactDOM',
  },
};
