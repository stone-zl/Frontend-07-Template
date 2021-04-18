学习笔记
安装
npm install -g yo

运行命令
  npm link
  yo toolchain
初步交互功能
 var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    // The name `constructor` is important here
    constructor(args, opts) {
      // Calling the super constructor is important so our generator is correctly set up
      super(args, opts);
    }
    async method1() {
        const answers = await this.prompt([
          {
            type: "input",
            name: "name",
            message: "Your project name",
            default: this.appname // Default to current folder name
          },
          {
            type: "confirm",
            name: "cool",
            message: "Would you like to enable the Cool feature?"
          }
        ]);
    
        this.log("app name", answers.name);
        this.log("cool feature", answers.cool);
      }
  };
初始化文件系统
var Generator = require("yeoman-generator");
module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }
  async step1() {
    this.fs.copyTpl(
      this.templatePath("index.html"),
      this.destinationPath("public/index.html"),
      { title: "初始化" }
    );
  }
};
安装特定的依赖包
var Generator = require("yeoman-generator");

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }
  initPackage() {
    const pkgJson = {
      devDependencies: {
        eslint: "^3.15.0",
      },
      dependencies: {
        react: "^16.2.0",
      },
    };

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
    this.npmInstall();
  }

  async step1() {
    this.fs.copyTpl(
      this.templatePath("index.html"),
      this.destinationPath("public/index.html"),
      { title: "初始化" }
    );
  }
};
mocha 地址
链接

安装
作为项目的开发依赖项
npm install --save-dev mocha
创建 add.js
function add(a, b) {
  return a + b;
}
module.exports = add;
创建 test 文件夹/test.js
mkdir test/touch test.js
test.js
var assert = require("assert");
var add = require("../add.js");
describe("add函数测试", function () {
  it("1+2等于3", function () {
    assert.equal(add(1, 2), 3);
  });
  it("-5+2等于-3", function () {
    assert.equal(add(-5, 2), -3);
  });
});
命令行运行
mocha
export 导出
修改 add.js
export function add(a, b) {
  return a + b;
}
test.js
var assert = require("assert");
import {add} from "../add";
describe("add函数测试", function () {
  it("1+2等于3", function () {
    assert.equal(add(1, 2), 3);
  });
  it("-5+2等于-3", function () {
    assert.equal(add(-5, 2), -3);
  });
});
下载依赖
npm i --save-dev @babel/core @babel/register
npm i @babel/preset-env --save-dev
创建.babelrc 文件配置
{
    "presets": ["@babel/preset-env"]
}
修改 package.json 中 scripts
 "scripts": {
    "test": "mocha --require @babel/register"
  },
运行
npm run test
安装 nyc
npm i --save-dev nyc
修改 package.json 中 scripts
 "scripts": {
    "test": "mocha --require @babel/register",
    "coverage": "nyc npm run test"
  },
查看覆盖率
 npm run coverage
引入 nyc 改变 export
修改 add.js
 export function add(a, b) {
  return a + b;
}
export function mul(a, b) {
  return a * b;
}
module.exports.add = add;
module.exports.mul = mul;
修改 test.js
var assert = require("assert");
import {add,mul} from "../add";
describe("add文件测试", function () {
  it("1+2等于3", function () {
    assert.equal(add(1, 2), 3);
  });
  it("-5+2等于-3", function () {
    assert.equal(add(-5, 2), -3);
  });
  it("5*2等于10", function () {
    assert.equal(mul(5, 2), 10);
  });
});
引入依赖
npm install --save-dev babel-plugin-istanbul
npm i @istanbuljs/nyc-config-babel --save-dev
修改.babelrc
{
    "presets": [
        "@babel/preset-env"
    ],
    "plugins": [
        "istanbul"
    ]
}
创建.nycrc
{
    "extends": "@istanbuljs/nyc-config-babel"
}
修改 package.json 中 scripts
 "scripts": {
    "test": "mocha --require @babel/register",
    "coverage": "nyc mocha"
  },
运行
npm run coverage