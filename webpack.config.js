const path = require('path');

module.exports = {
  mode: 'development',
  watch: true,
  module: {
    rules: [
        {
            test: /\.hbs$/i,
            loader: "handlebars-loader",
            options: {
              helperDirs: path.join(__dirname , "src", "author", "handlebars-helpers"),
              precompileOptions: {
                knownHelpersOnly: false,
              }
            }
        }
    ]
  },
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    alias: {
      jsonpath: path.resolve(__dirname, 'node_modules/jsonpath/')
    }
  }
};