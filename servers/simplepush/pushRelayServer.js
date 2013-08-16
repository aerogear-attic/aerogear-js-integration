var express = require('express');
var app = express();
var request = require('request');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.configure(function () {
    app.use(allowCrossDomain);
    app.use(express.bodyParser());
});

app.post('/tests/simplepush/sender', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    request({
        method: 'PUT',
        url: req.body.pushEndpoint,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        body: 'version=' + req.body.version
    });

    res.send(200);
});

app.listen(8888);
console.log('Push Relay Server Listening on port 8888');
