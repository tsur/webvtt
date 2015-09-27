/**
 *
 * The purpose of this docs is to provide different alternatives to download youtube videos for using it on
 * HTML5 video element. Youtube does not provides a public API for this as it forces users to use an iframe and
 * if trying to download the video resources it is blocked by browser CORS constrains, so in order to bypass it, we do
 * have three options:
 *
 * 1) Streaming Server
 *
 * Here, we're going to download the video from youtube, store it locally and then send it back to the user:
 *

 var http = require('http');
 var fs = require('fs');

 var download = function(url, dest, cb) {

    if(fs.exists(dest)) return cb(dest);

    var file = fs.createWriteStream(dest);

    http.get(url, function(response) {

      response.pipe(file);

      file.on('finish', function() {
        file.close(function(){

            cb(dest);
        });  // close() is async, call cb after close completes.
      });

    })
    .on('error', function(err) { // Handle errors

      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      if (cb) cb(err.message);

    });

  };

  var send = function(file, req, res){

      var range = req.headers.range;
      var positions = range.replace(/bytes=/, "").split("-");
      var start = parseInt(positions[0], 10);

      fs.stat(file, function(err, stats) {

        var total = stats.size;
        var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        var chunksize = (end - start) + 1;

        res.writeHead(206, {
          "Content-Range": "bytes " + start + "-" + end + "/" + total,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": "video/mp4"
        });

        var stream = fs.createReadStream(file, { start: start, end: end })
          .on("open", function() {
            stream.pipe(res);
          })
          .on("error", function(err) {
            res.end(err);
          });

      });

  };


 http.createServer(function (req, res) {

    var videoID = getVideoID(req.url);

    download(req.url, videoID, function(file){

        send(file, req, res);
    });

 }).listen(8888);

 * 2) Streaming Proxy Server
 *
 * Instead of downloading the video and then sending it, just send the data along we download it thus saving resources.
 * This is the solution below implemented.
 *
 * 3) Use an external service as youtubeinmp4.com (can also have CORS issues ...)
 *
 */
var http = require("http");
var qs = require('querystring');
var url = require('url');
var request = require('request');
var port = process.env.PORT || 8000;
var ip = 'localhost';

var streamer = function(req, res) {

  var data = url.parse(req.url, true).query;
  var id = data.video;
  var mimeType = data.type || 'video/mp4';

  if(!id || !mimeType) return res.end();

  console.log('reading metadata for', id, mimeType);

  // Let's make an request to `http:// www.youtube.com/get_video_info?video_id=<VIDEO_ID_HERE>`
  // to get some metadata. This is reverse-engineered from the Youtube embed player.
  request('http://www.youtube.com/get_video_info?video_id='+id, function(err, d_res, d_content) {

    // Check if there's any error
    if(!err && d_res.statusCode === 200){

      // No error happened.
      // Start parsing the content of the returned result.
      d_content = qs.parse(d_content);

      // If there's an API error _(such as copyright restrictions, video not allowed to embed, etc.)_
      // end the request with an error message.
      if(d_content.status.indexOf('ok') == -1){
        res.end(d_content.reason);
      }
      else {
        // There's no API errors, start getting information from it.

        // Log the video's title
        console.log('Requesting video "%s"',d_content.title);

        // Check whether the video is a YouTube live stream
        if((!!d_content.ps) && d_content.ps == "live"){
          // It's a live stream, let's call our live stream handler.
          // Tricky things **WILL** happen here.
          //live(d_content, res ,opts);
        }
        else {
          // It's just a normal video, stream it to the client using the conventional approch.

          //Get the streams from the API response
          var streams = String(d_content.url_encoded_fmt_stream_map).split(',');
          //Loop througn all streams
          for(var i = 0; i < streams.length; i++) {
            //Parse the stream
            var stream = qs.parse(streams[i]);

            console.log('stream', stream);
            //If the stream is compatable with the video type,
            //we return a function that can stream the video to the client.
            //Note: we **DO NOT** stream HD videos to save bandwidth.
            if (String(stream.type).indexOf(mimeType) > -1) {

              res.writeHead(200, {

                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"

              });

              //Pipe the stream out
              return request(stream.url + '&signature=' + (stream.sig || stream.s)).pipe(res);

            }
          }
        }
      }
    }
    else {
      // An error happened, end the connection.
      console.log('Error getting video metadata: ',err);
      res.end();
    }
  });

};

var server = http.createServer(streamer);

// Listen on the specified IP and port.
server.listen(port, function(){
  console.log('Server #%d listening at %s:%d', process.pid, ip, port);
});
