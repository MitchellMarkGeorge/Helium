import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

export const rendererConfig: Configuration = {
  // devtool: "source-map",
  module: {
    rules: [
      ...rules,
      // {
      //   test: /\.css$/,
      //   use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      // },
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
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },

      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
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
  plugins: [...plugins, new MiniCssExtractPlugin({ filename: './css/[name].css'})],
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx"],
    plugins: [new TsconfigPathsPlugin()],
  },
};
