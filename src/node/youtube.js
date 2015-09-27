module.exports = exports = function(url, proxy, fn) {

  var isYoutube = url && url.match(/(?:youtu|youtube)(?:\.com|\.be)\/([\w\W]+)/i);

  if (!isYoutube) return fn(false);

  var mp4url = proxy + "?video=";
  var id = isYoutube[1].match(/watch\?v=|[\w\W]+/gi);

  id = ((id.length > 1) ? id.splice(1) : id).toString();

  fn(mp4url + id);

};
