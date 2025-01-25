import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default (env, argv) => ({
  entry: "./scripts.ts",
  output: {
    filename: "scripts.js",
    path: path.resolve(dirname, "dist"),
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
      directory: dirname,
    },
    hot: true,
    liveReload: false,
  },
});
