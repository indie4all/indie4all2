const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const config = {
  module: {
    rules: [
        {
            test: /\.hbs$/i,
            loader: "handlebars-loader",
            options: {
              helperDirs: path.join(__dirname , "src", "handlebars-helpers"),
              precompileOptions: { knownHelpersOnly: false }
            }
        },
        {
          test: /\.(c|sc|sa)ss$/,
          use: [ { loader: MiniCssExtractPlugin.loader }, 'css-loader', 'sass-loader' ]
        },
        {
          test: /\.svg$/,
          type: 'asset/inline'
        }
    ]
  },
  plugins: [ 
    new MiniCssExtractPlugin(),
    new webpack.ProvidePlugin({
      $: "jquery",
      bootstrap: "bootstrap",
      bootprompt: "bootprompt",
      jQuery: "jquery"
    })
  ],
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    assetModuleFilename: 'assets/[hash][ext][query]',
    clean: true
  }
};

const webConfig = merge(config, {
  name: "web",
  plugins: [ 
    new HtmlWebpackPlugin({ template: './src/views/index.hbs' }),
    new CopyPlugin({patterns: [
      { from: "./src/manifest.json", to: "."}, 
      { from: "./src/favicon.ico", to: "."}]}) ],
  output: { path: path.resolve(__dirname, 'web') }
});

const distConfig = merge(config, {
  name: "dist",
  output: { path: path.resolve(__dirname, 'dist') }
});

module.exports = [distConfig, webConfig];