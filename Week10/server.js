const http = require("http");

http.createServer((request, response) => {
    let body = [];
    console.log('request:', request)
    request.on('error', err => {
        console.error(err);
    }).on('data', chunk => {
        console.log('http receive data:', chunk)
        body.push(chunk);
    }).on('end', () => {
        console.log('http receive end:')
        body = Buffer.concat(body).toString();

        console.log('body:', body);
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(`
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div>11111</div>
  <img src="" alt="" />
</body>
</html>
    `);
    });
}).listen(8088, () => {
    console.log('Server started');
});