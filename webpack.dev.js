 const { merge } = require('webpack-merge');
 const common = require('./webpack.common.js');
 const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const devConfig = {
  mode: 'development',
  watch: true,
  devtool: 'inline-source-map',
  //plugins: [ new BundleAnalyzerPlugin({analyzerMode: 'static'}) ]
};

module.exports = common.map(config => merge(config, devConfig))