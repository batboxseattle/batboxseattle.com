const path = require("path");

module.exports = (env, argv) => {
  return {
    entry: "./scripts.ts",
    output: {
      filename: "scripts.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/dist/",
    },
    mode: argv.mode,
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    devServer: {
      static: {
        directory: __dirname,
      },
      hot: true,
      liveReload: false,
    },
  };
};
