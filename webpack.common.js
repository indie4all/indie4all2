const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const webpack = require('webpack');

const config = {
  module: {
    rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
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
        },
        {
        test: /\.(png|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        }
    ]
  },
  plugins: [ 
    new MiniCssExtractPlugin(),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ],
  entry: './src/index.ts',
  output: {
    filename: '[name].js',
    assetModuleFilename: 'assets/[hash][ext][query]',
    clean: true
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  }
};

const webConfig = merge(config, {
  name: "web",
  plugins: [ 
    new HtmlWebpackPlugin({ template: './src/views/index.hbs', inject: 'head', scriptLoading: 'blocking' }),
    new CopyPlugin({patterns: [
      { from: "./src/manifest.json", to: "."},
      { from: "./src/icon-192.png", to: "."}, 
      { from: "./src/icon-512.png", to: "."}, 
      { from: "./src/favicon.ico", to: "."}]}),
      new WorkboxPlugin.GenerateSW({
       clientsClaim: true,
       skipWaiting: true,
     }),
    ],
  output: { 
    path: path.resolve(__dirname, 'web'),
    library: "IndieAuthor" 
  }
});

const distConfig = merge(config, {
  name: "dist",
  output: { 
    path: path.resolve(__dirname, 'dist'),
    library: "IndieAuthor"
  }
});

module.exports = [distConfig, webConfig];