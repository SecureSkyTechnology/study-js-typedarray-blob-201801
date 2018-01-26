module.exports = {
  // 生成されたJSにインラインでsource-mapを埋め込む。
  // https://webpack.js.org/configuration/devtool/
  devtool: 'inline-source-map',
  entry: {
    'browser/build/webpack-babel-build-demo': ['babel-polyfill', './src/webpack-babel-build-demo-main.js'],
    'browser/build/mocha-browser': ['babel-polyfill', './src/mocha-browser.js'],
    'test/mocha-node': ['babel-polyfill', './src/mocha-node.js']
  },
  output: {
    path: __dirname,
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.js$/,
      exclude: /node_modulels/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            'power-assert',
            ['env', {
              'modules': false,
              'targets': [
                'last 1 Chrome version',
                'last 1 Firefox version',
                'last 1 Edge version'
              ]
            }]
          ]
        }
      }]
    }]
  }
}
