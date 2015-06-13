var request = require("browser-request");

module.exports = exports = function(url, fn) {

  request({
    method: 'POST',
    url: 'http://localhost:8080/youtube', //'https://subcss-tsur.herokuapp.com/youtube',
    json: {
      url: url
    }
  }, function(error, response, body) {

    fn(body.src);

  });


};