const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    'gradient-generator': [
      path.resolve(__dirname, 'src/scss/styles.scss'),
      path.resolve(__dirname, 'src/index.ts'),
    ],
  },
  output: {
    filename: '[name].js',
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
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
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
