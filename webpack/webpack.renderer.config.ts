import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import MonacoEditorWebpackPlugin from "monaco-editor-webpack-plugin";

export const rendererConfig: Configuration = {
  // devtool: "source-map",
  module: {
    rules: [
      ...rules,
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, { loader: "css-loader" }],
      },
      // not sure why
      {
        test: /\.module\.s(a|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
          "sass-loader",
        ],
      },

      {
        test: /\.s(a|c)ss$/,
        exclude: /\.module.(s(a|c)ss)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },

      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
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
  plugins: [
    ...plugins,
    new MiniCssExtractPlugin({ filename: "./css/[name].css" }),
    new MonacoEditorWebpackPlugin(),
  ],
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx"],
    plugins: [new TsconfigPathsPlugin()],
  },
};
