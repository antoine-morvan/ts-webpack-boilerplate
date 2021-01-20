(() => {
  // -- REQUIRES / IMPORTS
  console.log(" > set new version");
  const fs = require("fs");
  const packageJson = require("../package.json");

  if (process.argv[3] === undefined) {
    console.error(
      "Error: missing version number in arguments.\nUsage : node path/to/bump_version.js path/to/package.json X.Y.Z"
    );
    return;
  }
  const packageJsonFile = process.argv[2];
  const newReleaseVersion = process.argv[3];
  packageJson.version = newReleaseVersion;
  console.log(" > new version : " + newReleaseVersion);

  fs.writeFileSync(packageJsonFile, JSON.stringify(packageJson, null, 2) + "\n");
  console.log(" > new version : " + newReleaseVersion);
})();
