var vtt2srt = require('vtt-to-srt');

module.exports = exports = function(vttString, fn) {

  var srtStream = vtt2srt();

  srtStream.write(vttString);
  srtStream.end(() => fn(srtStream.read().toString('utf-8')));

};
