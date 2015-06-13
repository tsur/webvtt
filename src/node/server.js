var http = require("http");
var express = require("express");
var bodyParser = require('body-parser');
var youtube = require('./youtube');
var app = express();
var port = process.env.PORT || 8080;

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(__dirname + "/../.."))

app.post('/youtube', function(req, res) {

  youtube(req.body.url, function(url) {

    res.json({
      src: url
    });

  });

});

var server = http.createServer(app);
server.listen(port);