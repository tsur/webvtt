var ffmpeg = require('fluent-ffmpeg');
var vtt2srt = require('vtt-to-srt');
var fs = require('fs');

module.exports = exports = function(file, vttString, fn) {

  const srtStream = vtt2srt();

  srtStream.write(vttString);
  srtStream.end();
  srtStream.pipe(fs.createWriteStream(__dirname + '/subtitles.srt'));

  ffmpeg(file)
    .outputOptions(
      '-vf subtitles='+__dirname + '/subtitles.srt'
    )
    .on('error', function(err) {
      console.log('Error: ' + err.message);
    })
    .save(__dirname + 'EEEAAA.mp4');

  fn();

};
