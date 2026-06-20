const path = require('path');
const webpack = require('webpack');
import { paths } from './gulpfile.babel'

module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      jquery: 'jquery',
      'window.jquery': 'jquery',
      $: 'jquery',
      'window.$': 'jquery',
    }),
  ],

  entry: {
    app: paths.scripts.src,
  },

  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/',
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          enforce: true,
        },
      },
    },
  },

  module: {
    rules: [
      /** Babel **/
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
        // npm install babel-loader @babel/core @babel/preset-env -D
      },
    ],
  },

  resolve: {
    alias: {
      '%modules%': path.resolve(__dirname, 'src/blocks/modules'),
    },
  },
};
