const path = require("path");
const fs = require("fs");

const walkSync = function (dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function (file) {
    if (fs.statSync(dir + file).isDirectory()) {
      filelist = walkSync(dir + file + "/", filelist);
    } else {
      filelist.push(dir + file);
    }
  });
  return filelist;
};

const NAME = require("../package.json").name;

module.exports = {
  mode: "development",
  entry: walkSync(`./target/output-node-with-test/test/`, []).filter(f => f.endsWith(".js")),
  output: {
    path: path.resolve(__dirname, "../target"),
    filename: "output-with-tests-webpack.js",
    library: `TsBoilerPlateLibWithTests`,
    libraryTarget: "umd"
  },

  node: { fs: "empty", net: "empty" },
  resolve: {
    alias: {
      "@tsboilerplate": path.resolve(__dirname, `../target/output-node-with-test/src/`),
      "@tsboilerplatetest": path.resolve(__dirname, `../target/output-node-with-test/test/`)
    },
    modules: ["node_modules"]
  },
  performance: {
    hints: "warning", // enum
    maxAssetSize: 20000000, // int (in bytes),
    maxEntrypointSize: 20000000, // int (in bytes)
    assetFilter: function (assetFilename) {
      // Function predicate that provides asset filenames
      return assetFilename.endsWith(".css") || assetFilename.endsWith(".js");
    }
  }
};
