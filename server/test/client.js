var http = require('http');
var zlib = require('zlib');
var querystring = require('querystring');
var options = {
    hostname: '127.0.0.1',
    port: '3000',
    path: '/test',
    method: 'POST',
    headers: {
        'Content-Type': 'form/x-www-form-urlencoded',
        'Content-Encoding': 'gzip'
    }
};

var client = http.request(options, (res) => {
    res.pipe(process.stdout);
});
var postBody = { nick: 'chyingp' };
console.log(postBody)
var queryObj = querystring.stringify(postBody)
console.log(queryObj)
// 注意：将 Content-Encoding 设置为 gzip 的同时，发送给服务端的数据也应该先进行gzip
var buff = zlib.gzipSync(queryObj);



client.end(buff);


