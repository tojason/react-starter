'use strict';

const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");

const BUILD_DIR = path.resolve(__dirname, 'public');
const APP_DIR = path.resolve(__dirname, 'src');

const config = {

  // split a large bundle file into 2 chunks
  entry: {
    app: [APP_DIR + '/index.jsx'],
    vendor: ['react', 'react-dom', 'react-router', 'react-router-dom']
  },

  output: {
    path: BUILD_DIR,
    filename: '[name].bundle.js',
  },

  // configure webpack dev server, with hot-reloading enable
  devServer: {
    // url is host under 0.0.0.0:port, it allows other people to visit this website from
    // other computers
    inline: true,
    port: 5000,
    hot: true, // live updating css without a refresh on the webpack
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },

  context: path.join(__dirname, 'src'),

  module : {
    rules: [
      {
        test : /\.jsx?/,
        exclude : [/node_modules/, /bower_components/],
        include : APP_DIR,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env"]
          }
        }
      },
      {
        test: /\.scss$/,
        // the order of the following loaders is important
        loaders: ['style-loader', 'css-loader?-url', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        // the order of the following loaders is important
        loaders: ['style-loader', 'css-loader?-url', 'postcss-loader']
      }
    ]
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: "vendor",
          enforce: true,
          chunks: "initial",
          minChunks: 2
        }
      }
    }
  },

  plugins: [
    new CopyWebpackPlugin([
      {from: APP_DIR + '/html/', to: BUILD_DIR},
      {from: APP_DIR + '/assets/', to: BUILD_DIR + '/assets/'}
    ], {
      copyUnmodified: false,
      debug: 'debug'
    }),
    new HTMLWebpackPlugin({
      template: './html/index.html',
      inject: 'body',
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css"
    }),
    new webpack.HotModuleReplacementPlugin()
  ]

};

module.exports = config;
