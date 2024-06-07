import webpack from "webpack";

import { plugins } from "./webpack.plugins";
import webpackPaths from "./webpack.paths";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import MonacoEditorWebpackPlugin from "monaco-editor-webpack-plugin";
import { Configuration as DevServerConfiguration } from "webpack-dev-server";
import path from "path";
import url from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";

interface Configuration extends webpack.Configuration {
  devServer?: DevServerConfiguration;
}


const rendererConfig: Configuration = {
  // devtool: "source-map",
  target: ["web", "electron-renderer"],
  entry: path.resolve(webpackPaths.srcRenderer, "main.ts"),
  module: {
    rules: [
      {
        // We're specifying native_modules in the test because the asset relocator loader generates a
        // "fake" .node file which is really a cjs file.
        test: /native_modules[/\\].+\.node$/,
        use: "node-loader",
      },
      {
        test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
        parser: { amd: false },
        use: {
          loader: "@vercel/webpack-asset-relocator-loader",
          options: {
            outputAssetBase: "native_modules",
          },
        },
      },
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
      {
        test: /\.css$/,
        // use: [MiniCssExtractPlugin.loader, { loader: "css-loader" }],
        use: ["style-loader", "css-loader"],
      },
      // not sure why this isn't working
      // {
      //   test: /\.module\.scss$/,
      //   use: [
      //     // MiniCssExtractPlugin.loader,
      //     "style-loader",
      //     {
      //       loader: "css-loader",
      //       options: {
      //         modules: true,
      //       },
      //     },
      //     "sass-loader",
      //   ],
      // },

      {
        test: /\.scss$/,
        exclude: /\.module\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },

      {
        test: /\.svg$/,
        use: [{
          loader: "@svgr/webpack",
          options: {
            typescript: true,
          }
        }],
      },
      {
        test: /\.ttf$/,
        type: "asset/resource",
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/[name][ext]",
        },
      },
    ],
  },
  devServer: {
    // open: false,
    port: 4000,
    hot: true,
    static: {
      publicPath: "/",
    },
    compress: true,
    historyApiFallback: true,
  },
  output: {
    path: webpackPaths.distRenderer,
    filename: "[name].js",
  },
  plugins: [
    // ...plugins,
    // cant use if not using
    // new MiniCssExtractPlugin({ filename: "./css/[name].css" }),
    new MonacoEditorWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(webpackPaths.srcRenderer, "index.html"),
      filename: path.join(webpackPaths.distRenderer, "index.html"), // might not be needed
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx", ".json"],
    plugins: [new TsconfigPathsPlugin()],
  },
};

export default rendererConfig;
