const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = common.map(config => merge(config, { 
    mode: 'production',
    optimization: {
        minimizer: [new TerserPlugin({
            terserOptions: { 
                keep_fnames: true
            }
        }),
        new CssMinimizerPlugin()]
    }
 }))