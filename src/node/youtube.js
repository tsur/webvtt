module.exports = exports = function(url, proxy, fn) {

  var isYoutube = url && url.match(/(?:youtu|youtube)(?:\.com|\.be)\/([\w\W]+)/i);

  if (!isYoutube) return fn(false);

  var mp4url = proxy + "?video=";
  var id = isYoutube[1].match(/watch\?v=|[\w\W]+/gi);

  id = ((id.length > 1) ? id.splice(1) : id).toString();
  id = ~id.indexOf('&') ? id.substr(0, id.indexOf('&')) : id;

  fn({host:mp4url, id:id, url:mp4url+id});

};
