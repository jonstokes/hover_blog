'use strict';

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require.main.require('../webpack.config');

var devServer = function devServer(proxy) {
  return new WebpackDevServer(webpack(webpackConfig), {
    contentBase: '/build/',
    proxy: proxy,
    stats: {
      colors: true
    },
    hot: true,
    historyApiFallback: true
  });
};

module.exports = devServer;