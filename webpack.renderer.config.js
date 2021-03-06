const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

const rules = require("./webpack.rules");

const isDevelopment = process.env.NODE_ENV !== "production";

rules.push(
  {
    test: /\.css$/,
    use: [{ loader: "style-loader" }, { loader: "css-loader" }],
  },
  {
    test: /\.jsx?$/,
    include: path.resolve(__dirname, "src"),
    use: [
      {
        loader: "thread-loader",
        options: {
          workers: 2,
          workerParallelJobs: 50,
          workerNodeArgs: ["--max-old-space-size=1024"],
          poolRespawn: isDevelopment ? false : true,
          poolTimeout: 2000,
        },
      },
      {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-react"],
          plugins: [
            "@babel/plugin-syntax-class-properties",
            "@babel/plugin-proposal-class-properties",
          ],
        },
      },
    ],
  },
  {
    test: /\.node$/,
    use: "node-loader",
  }
);

module.exports = {
  mode: isDevelopment ? "development" : "production",
  devtool: "source-map",
  module: {
    rules,
  },
  resolve: {
    alias: {
      machines: path.resolve(__dirname, "src/render/app/machines"),
      common: path.resolve(__dirname, "src/render/app/common"),
      utils: path.resolve(__dirname, "src/render/app/utils"),
      global: path.resolve(__dirname, "src/"),
    },
  },
  target: "electron-renderer",
  plugins: [
    new HardSourceWebpackPlugin(),
    new webpack.ExternalsPlugin("commonjs", ["electron"]),
  ],
};
