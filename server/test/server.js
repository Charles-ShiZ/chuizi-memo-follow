var http = require('http');
var zlib = require('zlib');
var querystring = require('querystring');
var parsePostBody = function (req, done) {
    var contentEncoding = req.headers['content-encoding'];
    var stream = req;

    // 关键代码如下
    if(contentEncoding === 'gzip') {
        stream = zlib.createGunzip();
        req.pipe(stream);
    }

    var arr = [];
    var chunks;

    stream.on('data', buff => {
        arr.push(buff);
    });

    stream.on('end', () => {
        chunks = Buffer.concat(arr);        
        done(chunks);
    });

    stream.on('error', error => console.error(error.message));
};

var server = http.createServer(function (req, res) {
    parsePostBody(req, (chunks) => {
        var body = querystring.parse(chunks.toString())
        console.log(body)
        res.end(`Your nick is ${body}`)
    });
});

server.listen(3000);