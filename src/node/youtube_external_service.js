var request = require("request");
var htmlparser = require("htmlparser2");

module.exports = exports = function(url, fn) {

  var isYoutube = url && url.match(/(?:youtu|youtube)(?:\.com|\.be)\/([\w\W]+)/i);

  if (!isYoutube) return fn(false);

  var mp4url = "http://www.youtubeinmp4.com/redirect.php?video=";
  var id = isYoutube[1].match(/watch\?v=|[\w\W]+/gi);
  var src;

  id = ((id.length > 1) ? id.splice(1) : id).toString();

  request(mp4url + id, function(error, response, body) {

    if (!error && response.statusCode == 200) {

      var parser = new htmlparser.Parser({
        onopentag: function(name, attribs) {
          if (name === "a" && attribs.id === "downloadMP4" && attribs.href.indexOf('redirect') > -1) {
            src = 'http://www.youtubeinmp4.com/' + attribs.href;
          }
        },

        onend: function() {

          fn(src);
        }
      }, {
        decodeEntities: true
      });

      parser.write(body);
      parser.end();


    }

  });


};