import webpack from "webpack";
import 'dotenv/config'

import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import path from "path";
import webpackPaths from "./webpack.paths";
import url from "url";

const isDev = process.env.NODE_ENV === "development";

const HELIUM_WEB_ENTRY = isDev
  ? "http://localhost:4000"
  : url.format({
      // think about this
      // should it use __dirname instead
      pathname: path.join(webpackPaths.distRenderer, "index.html"),
      protocol: "file:",
      slashes: true,
    });

const HELIUM_PRELOAD_ENTRY = path.join(webpackPaths.distMain, "preload.js")

const mainConfig: webpack.Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  devtool: 'source-map',
  target: "electron-main",
  entry: {
    main: path.join(webpackPaths.srcMain, "main.ts"),
  }, // use absolute for this
  // Put your normal webpack config below here
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
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },
  node: {
    // is this needed????
    __dirname: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      HELIUM_WEB_ENTRY: JSON.stringify(HELIUM_WEB_ENTRY),
      HELIUM_PRELOAD_ENTRY: JSON.stringify(HELIUM_PRELOAD_ENTRY),
      "process.env.DEV_STORE_NAME": JSON.stringify(process.env.DEV_STORE_NAME),
      "process.env.DEV_STORE_URL": JSON.stringify(process.env.DEV_STORE_URL),
      "process.env.DEV_STORE_PASSWORD": JSON.stringify(process.env.DEV_STORE_PASSWORD),
    }),
  //   new CopyPlugin({
  //     patterns: [{
  //       from: 'assets/icons/',
  //       to: '../assets/icons/',
  //     }]
  //   }),
  ],
  output: {
    path: webpackPaths.distMain,
    filename: "[name].js",
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
    plugins: [new TsconfigPathsPlugin()],
  },
};

const preloadConfig: webpack.Configuration = {
  devtool: "source-map",
  target: "electron-preload",
  entry: {
    preload: path.join(webpackPaths.srcMainPreload, "index.ts"),
  }, // use absolute for this
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
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },
  node: {
    // is this needed????
    __dirname: false,
  },
  output: {
    path: webpackPaths.distMain,
    filename: "[name].js",
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
    plugins: [new TsconfigPathsPlugin()],
  },
};

export default [mainConfig, preloadConfig];
