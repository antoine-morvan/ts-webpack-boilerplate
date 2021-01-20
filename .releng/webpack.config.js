const path = require("path");

const NAME = require("../package.json").name;

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, `../target/output-node/library-api.js`),
  output: {
    path: path.resolve(__dirname, "../target"),
    filename: `output-webpack.js`,
    library: `TsBoilerPlateLib`,
    libraryTarget: "umd"
  },

  node: { fs: "empty", net: "empty" },
  resolve: {
    alias: {
      "@tsboilerplate": path.resolve(__dirname, `../target/output-node/`)
    },
    modules: ["node_modules"]
  },
  performance: {
    hints: "warning", // enum
    maxAssetSize: 1000000, // int (in bytes),
    maxEntrypointSize: 1000000, // int (in bytes)
    assetFilter: function (assetFilename) {
      // Function predicate that provides asset filenames
      return assetFilename.endsWith(".css") || assetFilename.endsWith(".js");
    }
  }
};
