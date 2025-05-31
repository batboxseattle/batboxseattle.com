import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// noinspection JSUnusedGlobalSymbols
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
    port: 8080,
    static: {
      directory: dirname,
    },
    hot: true,
    liveReload: false,
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error("webpack-dev-server is not defined");
      }

      devServer.app.get("/icon/site.webmanifest", (_, response, next) => {
        response.setHeader(
          "Content-Type",
          `application/manifest+json; charset=utf-8`,
        );
        next();
      });

      return middlewares;
    },
  },
});
