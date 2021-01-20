module.exports = function (config) {
  config.set({
    frameworks: ["mocha", "chai"],
    files: ["../target/output-with-tests-webpack.js"],
    reporters: ["progress"],
    port: 9876, // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ["ChromeHeadless", "Firefox"],
    autoWatch: false,
    concurrency: 4,
    customLaunchers: {
      FirefoxHeadless: {
        base: "Firefox",
        flags: ["-headless"]
      }
    },
    client: {
      mocha: {
        slow: require("../package.json").mocha.slow,
        timeout: require("../package.json").mocha.timeout
      }
    }
  });
};
