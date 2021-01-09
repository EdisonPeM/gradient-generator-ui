const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

const config = {
  entry: path.resolve(__dirname, 'src', 'index'),
  output: {
    filename: 'gradient-generator.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'GradientGenerator',
    libraryExport: 'GradientGenerator',
    libraryTarget: 'umd',
  },
  resolve: { extensions: ['.js', '.ts'] },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/typescript'],
              plugins: [
                '@babel/proposal-class-properties',
                '@babel/proposal-object-rest-spread',
              ],
            },
          },
        ],
        exclude: '/node_modules/',
      },
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [new CleanWebpackPlugin()],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          sourceMap: true,
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },
};

module.exports = (env, argv) => {
  config.mode = argv.mode;
  if (argv.mode === 'development') {
    config.watch = true;
  }

  return config;
};
