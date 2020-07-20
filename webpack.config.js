const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
  },
  devServer: {
    index: 'index.html',
    compress: false,
    contentBase: path.join(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-react-jsx",
                {
                  pragma: "ToyReact.createElement",
                  // "pragmaFrag": "ToyReact.Fragment"
                },
              ],
            ],
          },
        },
      },
    ],
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
};
