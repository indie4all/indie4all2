 const { merge } = require('webpack-merge');
 const common = require('./webpack.common.js');

const devConfig = {
  mode: 'development',
  watch: true,
  devtool: 'inline-source-map'
};

module.exports = common.map(config => merge(config, devConfig))