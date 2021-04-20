学习笔记

工具链——发布系统
发布系统包括三个子系统：

线上系统（服务端）---- Linux/server---------------- 为真实用户服务。
本地/server ---- 复制到服务器----Linux/server
发布系统（服务端）---- Linux/publish-server---- 为程序员向线上发布服务。
本地/publish-server ----复制到服务器----Linux/publish-server
发布系统（客户端）---- 本地/publish-tool-------- 命令行工具与线上服务系统同步对接。
最终发布流程：

发布系统（客户端）==文件==> 发布系统（服务端）==文件==> 线上系统（服务端）
以上“线上系统--服务端” & “发布系统--服务端”，可以同级部署，也可以是独立集群。

1、实现线上 web 服务
1.1、安装虚拟机及环境
​ 由于没有现成服务器，此处安装 Linux 虚拟机，虚拟机上运行 node.js 模拟线上服务器。

准备工作：安装虚拟机Oracle virtualBox
创造虚拟机，选择Linux系统
选择光盘镜像，选择安装的Server install image
需要修改镜像地址（不修改速度则会比较慢），修改为阿里云的镜像地址： http://mirrors.aliyun.com/ubuntu
其他都选择默认，然后进入安装状态，可以通过日志查看
重启虚拟机，输入用户名、密码登录
安装nodejs： sudo apt install nodejs
安装npm: sudo apt install npm
安装sudo apt install -g n，n 是 Node 的版本管理
直接使用sudo n lasted 就可以更新 Node 的版本
需要重新设置PATH=$PATH；
node --version 可以查看node安装为最新版本
1.2、利用Express/scp实现线上服务
​ Express 是目前使用最广泛的服务器框架。如果发布模式是前后端高度分离的，则前端代码是发布 HTML，服务端的数据由 HTML 和 JavaScript 通过Ajax 请求来获取。在此主要是对静态文件的发布进行介绍，服务端混合发布暂不涉及（由于可能需要和后端同学商量方案、前端是否拥有独立发布的权利等，涉及现实情况来考虑）。

1.2.1、先在本地创建 node server
通过应用生成器工具 express-generator 可以快速创建一个应用的骨架。

$ mkdir server
$ cd server
$ npx express-generator
$ npm install
主要文件目录介绍

| nodeServer/app.js --- 主要模板文件，可以不需要修改
--｜ nodeServer/views --- jade 模板，可以不需要
--｜ nodeServer/routes --- 路由配置，可以不需要
--｜ nodeServer/public --- 编写我们主要逻辑的目录
		--｜ nodeServer/public/index.html --- 新建index.html文件，打开默认端口 http://localhost:3000/ 展示该页面
运行项目

$ npm start
至此，本地的 node.js 服务，创建成功，在默认端口 http://localhost:3000/ 可展示。

1.2.2、再将上述 server 上传到虚拟机
在虚拟机服务器中，安装apt install OpenSSH(默认安装了则不需要在安装)，由于Ubuntu的服务器，默认是不启动；

启动服务器，默认在22端口启动：

$ service ssh start
创建server文件夹：

$ mkdir server
在虚拟机服务器中，设置端口转发，在Network的Port Forwarding进行设置；

新建主机端口：“8022”；
子系统端口：“22”；
在Mac系统上可以使用scp命令（其它操作系统可自行安装），将本地目录的文件资源拷贝到虚拟机服务器上。

server $ scp -P 8022 -r ./* thales@127.0.0.1:/home/thales/server
在虚拟机服务器中，设置端口转发，在Network的Port Forwarding进行设置；

新建主机端口：“8080”；
子系统端口：“3000”；
启动虚拟机服务器：

thales@thales-server:～$ cd server
thales@thales-server:～$ npm start
至此，虚拟机模拟线上静态服务器创建成功，在默认端口 http://localhost:8080/ 可展示，且可以得到相对路径下的文件，如：http://localhost:8080/stylesheets/style.css 访问虚拟机服务器端口中的css文件。

2、实现发布服务：服务端&客户端--通信
发布的系统的组成：

服务器端（服务端） ---- publish-server
发布工具（客户端） ---- publish-tool
publish-tool 将文件通过http方式传输到 publish-server
由于发布的服务的组成由服务端/客户端两个部分组成，故先实现简单的服务端/客户端的通信，然后再渐进的将复杂的发布系统逐步完成。

了解 Node.js 流分两部分：

一部分是只读的流（获取数据），主要使用的是流对象的close 和data事件；
另一部分则是只写的流，主要是用的是write 和 end 方法；
其中write 不是同步方法，如果上一个还没有写完，则会通过排队缓存的方法进行。
2.1、实现发布服务的服务器端
本地创建：publish-server 项目文件夹/server.js文件/node环境

$ mkdir publish-server
$ cd publish-server 
$ npm init
$ tuch server.js
server.js中使用http 发起服务

let http = require("http")

http.createServer(function(req, res) {
    console.log(req)
    res.end("hello zhz!")
}).listen(8082)
至此，一个简陋的，发布服务的服务器端创建成功，在默认端口 http://localhost:8082/ 可展示。

2.2、实现发布服务的客户端
本地创建：publish-tool 项目文件夹/publish.js文件/node环境

$ mkdir publish-tool
$ cd publish-tool 
$ npm init
$ tuch publish.js
publish.js中使用request 发起服务

let http = require("http")

let request = http.request({
  hostname: "127.0.0.1",
  port: 8082
}, response => {
  console.log(response);
})

request.end();
node 运行 publish.js

$ node publish.js
至此，一个简陋的，客户端请求创建成功，服务器在8082端口收到请求，返回给客户端response 。

3、改造发布服务：实现单文件上传
改造发布服务器文件夹publish-server，将读取到的文件写入到指定路径../server/public/index.html

publish-server/server.js

let http = require("http")
let fs = require("fs")

http.createServer(function(request, response) {
    console.log(request.headers);

    let outFile = fs.createWriteStream("../server/public/index.html");

    request.on("data", chunk => {
        outFile.write(chunk);
    })

    request.on("end", chunk => {
        outFile.end();
        response.end("success");
    })
}).listen(8082)
publish-server/package.json

{
  "name": "publish-server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node ./server.js",
    "publish": "scp -r -P 8022 ./* thales@127.0.0.1:/home/thales/publish-server",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
发布服务客户端工具publish-tool文件夹

新建示例文件sample.html，以供发布服务的服务端读取

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello</title>
</head>
<body>
    <h1>震撼着！震撼着！！！zhz</h1>
</body>
</html>
改造客户端服务器文件夹publish.js，读取新建示例文件sample.html

let http = require("http")
let fs = require("fs")

let request = http.request({
    hostname: "127.0.0.1",
    port: 8882,
    method: "POST",
    headers: {
        "Content-Type": "application/octet-stream"
    }
}, response => {
    console.log(response)
})

let file = fs.createReadStream("./sample.html")

file.on("data", chunk => {
    console.log(chunk)
    request.write(chunk)
})

file.on("end", chunk => {
    console.log("finish")
    request.end(chunk)
})
Linux虚拟机中，在与server文件夹同级目录中新建publish-server文件夹；

将本地publish-server文件夹下所有文件复制到服务器publish-server文件夹；

$ cd publish-server
$ npm run publish
Linux虚拟机中，将server&publish-server两个服务器打开

server $ npm start&
publish-server $ npm start&
在本地运行publish-tool中的publish.js文件

$ node publish.js
至此，打通了本地客户端与两个系统的线上服务端的单文件传输，代表线上系统服务的本地端口localhost:8080打开后展现出publish-tool文件夹中sample.html文件。

但实际工程中一般都要发布多文件。

接下来记录，使用node压缩相关的包（archiver&unzipper）实现多文件发布。

4、改造发布服务：实现多文件上传
知识点：
为了避免流处理中遇到一些麻烦，故使用 pipe() 能够将一个可读的流导入进一个可写的流；
写入流考虑drain情况；
监听事件不方便；
archiver对文件夹下的多文件进行压缩；
unzipper对压缩后的文件进行解压；
发布系统中，将目标文件压缩，并填入request流

archiver需先安装：$ npm install archiver --save
publish-tool/publish.js

let http = require("http")
let fs = require("fs")

let request = http.request({
    hostname: "127.0.0.1",
    port: 8082,
    method: "POST",
    headers: {
        "Content-Type": "application/octet-stream",
    }
}, response => {
    console.log(response)
})


// 对(sample)文件夹下的内容进行压缩
const archiver = require('archiver');
const archive = archiver("zip", {
    zlib: { level: 9 }
});
archive.directory("./sample/", false);
archive.finalize(); // 表示为压缩工具填好了压缩内容
archive.pipe(fs.createWriteStream("tmp.zip"));

// 将压缩后的文件流倒入request流
archive.pipe(request);
在线上系统中，将接收到的 request 流中的压缩文件解压

unzipper需先安装：$ npm install unzipper --save
publish-server/server.js

let http = require("http")
let unzipper = require("unzipper")

http.createServer(function(request, response) {
    console.log("request")
    // let outFile = fs.createWriteStream("../server/public/template.zip");
    // request.pipe(outFile)

    // 将压缩后的文件解压
    request.pipe(unzipper.Extract({ path: '../server/public' }));
}).listen(8082)
在 publish-tool 文件夹下新建sample文件夹，文件夹中可随意新建几个文件或图片；

本地打开server/server.js & publish-server/server.js两个服务器；
通过 node 运行 publish.js 工具，对多sample文件下的多文件进行上传；
若publish-tool/sample文件中的内容，最终都被解压到了 server/public 文件夹下，则说明多文件上传成功。
至此，已经掌握了，通过压缩包进行多文件上传，并且进行线上部署的能力。

但实际情况下，是不允许所有人都有上传压缩包，并进行部署的权限的。

未解决该问题，接下来记录登陆鉴权的内容。

5、GitHub oAuth为发布服务鉴权
publish-tool/publish.js 打开：https://github.com/login/oauth/authorize；

因为publish-server/server.js listen(8082)，故在GitHub 设置Callback URL为http://localhost:8082/auth；
publish-server/server.js auth路由：接收 code ；

publish-server/server.js auth路由：用 code + client_id + client_secret 换 token；

publish-tool/publish.js 创建客户端服务器，以便接受 token；

publish-tool/publish.js 接受 token ，携带 token 点击发布；

publish-server/server.js publish路由：token 获取用户信息，检查权限；

publish-server/server.js publish路由：接受发布；

publish-tool/publish.js

let http = require("http")
let fs = require("fs")
let child_process = require("child_process")
let querystring = require("querystring")

/**
 * 1、打开：https://github.com/login/oauth/authorize；
 * 
 * 4、创建客户端服务器，以便接受 token；
 * 5、接受 token ，携带 token 点击发布；
 */

// 1、打开：https://github.com/login/oauth/authorize；
child_process.exec(`open https://github.com/login/oauth/authorize?client_id=Iv1.56c92eea64ca270d`)

// 4、创建客户端服务器，以便接受 token；
http.createServer(function(request, response) {
    let query = querystring.parse(request.url.match(/^\/\?([\s\S]+)$/)[1])
    
    // 5、接受 token ，携带 token 点击发布；
    publish(query.token);
}).listen(8083)

function publish(token) {
    let request = http.request({
        hostname: "127.0.0.1",
        port: 8082,
        path: "/publish?token=" + token,
        method: "POST",
        headers: {
            "Content-Type": "application/octet-stream",
        }
    }, response => {
        console.log(response);
        // request.end("succese!");
        // response.end("<h1>success!</h1>")
    })
    
    // 对(sample)文件夹下的内容进行压缩
    const archiver = require('archiver');
    const archive = archiver("zip", {
        zlib: { level: 9 }
    });
    archive.directory("./sample/", false);
    archive.finalize(); // 表示为压缩工具填好了压缩内容
    archive.pipe(fs.createWriteStream("tmp.zip"));
    
    // 将压缩后的文件流倒入request流
    archive.pipe(request);
}
publish-server/server.js

let http = require("http")
let https = require("https")
let unzipper = require("unzipper")
let querystring = require("querystring")
const { callbackify } = require("util")

/**
 * 2、auth路由：接收 code ；
 * 3、auth路由：用 code + client_id + client_secret 
 * 
 * 6、publish路由：token 获取用户信息，检查权限；
 * 7、publish路由：接受发布；
 */

function auth(request, response) {
    
    // 2、auth路由：接收 code ；
    let query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1])
    console.log("auth____query:", query.code) // query: [Object: null prototype] { code: 'd1d18db1375e6589d7ef' }

    // 3、auth路由：用 code + client_id + client_secret 换 token；
    getToken(query.code, function(info) {
        console.log("auth____info", info);
        response.write(`<a href="http://localhost:8083?token=${info.access_token}">send token to publish-tool/publish(8083)</a>`);
        response.end();
    });
}

function getToken(code, callback) {
    let request = https.request({
        hostname: "gitHub.com",
        path: `/login/oauth/access_token?code=${code}&client_id=Iv1.56c92eea64ca270d&client_secret=a5c7ca868a0accb3475bf46dd19192e839cd6029`,
        port: 443,
        methods: "POST"
    }, function(response) {
        let body = "";
        response.on("data", chunk => {
            body += (chunk.toString());
        })
        response.on("end", chunk => {
            callback(querystring.parse(body));
        })
    });
    request.end();
}

function getUser(token, callback) {
    let request = https.request({
        hostname: "api.gitHub.com",
        path: `/user`,
        port: 443,
        methods: "GET",
        headers: {
            Authorization: `token ${token}`,
            "User-Agent": "toy-publish"
        }
    }, function(response) {
        let body = "";
        response.on("data", chunk => {
            body += (chunk.toString());
        })
        response.on("end", chunk => {
            callback(JSON.parse(body))
        })
    });
    request.end();
}

function publish(request, response) {
    let query = querystring.parse(request.url.match(/^\/publish\?([\s\S]+)$/)[1])

    // 6、publish路由：token 获取用户信息，检查权限；
    getUser(query.token, function(info) {

        // 7、publish路由：接受发布；
        if(info.login === "FreeWisdom") {
            // 将压缩后的文件解压
            request.pipe(unzipper.Extract({ path: '../server/public' }));
            request.on("end", function() {
                response.end("success!")
            })
        }
    });
}

http.createServer(function(request, response) {
    if(request.url.match(/^\/auth\?/))
        return auth(request, response)
    if(request.url.match(/^\/publish\?/))
        return publish(request, response)
}).listen(8082)