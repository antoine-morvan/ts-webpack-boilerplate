# Typescript / Webpack Boilerplate

## NodeJS Dependencies

```
npm clean-install
```

## Build

```
# build all (web + manager + tests for karma)
npm run build
```

## Test

```
# unit tests with coverage
npm run test-coverage

# karma tests (run tests in browser)
# requires the correspinding browser to be installed
npm run build-karma
npm run karma-firefox
npm run karma-chrome
```

## All In One

```
npm run all
```

## Ubuntu Setup

### Build Environment

Setup NodeJS: https://nodejs.org/en/download/package-manager/

Using [NVS](https://github.com/jasongin/nvs):

```
# 1- install git/curl to fetch dependencies
sudo apt install git curl

# 2- install NodeJS LTS via NVS (in user dir: no sudo)
export NVS_HOME="$HOME/.nvs"
git clone https://github.com/jasongin/nvs "$NVS_HOME"
. "$NVS_HOME/nvs.sh" install
nvs add lts
nvs use lts
nvs link lts
```

### Development Environment

- Setup Visual Studio Code: https://code.visualstudio.com/docs/setup/linux
- Start vscode in project folder
  - from anywhere: `vscode path/to/project`
  - from vscode: File / Open Folder / `path/to/project`
- Install recommended extensions (bottom right popup)

## Windows Setup

### Build Environment

- Install nodejs LTS (https://nodejs.org/en/download/)

### Development Environment

- Install vscode stable (https://code.visualstudio.com/#alt-downloads)
- Open vscode in porject: File / Open Folder / `path/to/project`
- Install recommended extensions (bottom right popup)
