"use strict";

import {
  EventEmitter
}
from 'events';

import {
  inherits
}
from 'util';

import {
  h
}
from 'virtual-dom';

import plyr from 'plyr';

import getYoutube from '../../node/youtube';
import exportVideo from '../../node/export_video';

inherits(Viewer, EventEmitter);

function Viewer(app, proxyUrl) {

  this.app = app;
  this.proxyUrl = proxyUrl;

}

Viewer.prototype.initViewer = function() {

  const processDragOverOrEnter = function(event) {

    if (event) event.preventDefault();

    event.dataTransfer.effectAllowed = 'copy';

    return false;

  };

  this.overlayText = document.querySelector('.overlay p');
  this.input = document.querySelector('.overlay input.file');
  this.inputYoutube = document.querySelector('.overlay input.youtube');
  this.video = document.querySelector('.overlay video');
  this.overlay = document.querySelector('.overlay');
  this.exportStrBtn = document.querySelector('.export-str');
  this.exportVttBtn = document.querySelector('.export-vtt');

  this.video.setAttribute('crossorigin', 'anonymous');

  this.overlayClickEvent = event => {

    if (event.target.tagName.toLowerCase() != 'input') this.input.click();

  };

  this.overlay.addEventListener('click', this.overlayClickEvent);
  this.exportStrBtn.addEventListener('click', event => this.downloadSrt());
  this.exportVttBtn.addEventListener('click', event => this.downloadVtt());

  this.input.addEventListener('change', (e) => this.processVideoFile(e, 'change'));

  this.inputYoutube.addEventListener('keyup', (e) => {

    if (e.keyCode === 13 || e.which === 13) {

      getYoutube(this.inputYoutube.value, this.proxyUrl, tube => this.loadVideo(tube));
    }

  });

  this.app.on('updatedVTT', (text) => this.addSubtitles(text));

  this.overlay.addEventListener('drop', (e) => this.processVideoFile(e, 'drop'));

  this.overlay.addEventListener('dragover', processDragOverOrEnter);

  this.overlay.addEventListener('dragenter', processDragOverOrEnter);

  document.addEventListener('drop', (e) => e.preventDefault());

  document.addEventListener('dragover', (e) => e.preventDefault());

  document.addEventListener('dragenter', (e) => e.preventDefault());

};

Viewer.prototype.addSubtitles = function(text) {

  if(!this.player) return;

  this.player.captions(this.convertToVTT(text || this.app.views.editor.getText()));

};

Viewer.prototype.convertToVTT = function(src) {

  const utf8Tob64 = (str) => window.btoa(unescape(encodeURIComponent(str)));
  // const utf8Tob64 = (str) => window.btoa(str);

  return 'data:text/vtt;base64,' + utf8Tob64(src);

};

Viewer.prototype.loadVideo = function(file) {

  // Unbind input click event handler
  this.overlay.removeEventListener('click', this.overlayClickEvent);
  this.overlayClickEvent = null;

  this.overlayText.classList.add('hidden');
  this.video.classList.remove('hidden');
  this.inputYoutube.classList.add('hidden');

  const player = plyr.setup(this.overlay, {captions:{defaultActive: true}})[0];

  const videoType = file.type ? file.type : 'video/mp4';
  const src = file.url ? {src: file.id, type: 'youtube'} : {src: window.URL.createObjectURL(file), type: videoType};
  //const src = file.url ? {src: file.url, type: videoType} : {src: window.URL.createObjectURL(file), type: videoType};

  player.source({
    type:       'video',
    title:      'Example title',
    sources: [src],
    tracks:     [{
      kind:   'captions',
      label:  'English',
      srclang:'en',
      src:    this.convertToVTT(this.app.views.editor.getText()),
      default: true
    }]
  });

  this.app.views.editor.setPlayer(player);

  this.player = player;

};

Viewer.prototype.processVideoFile = function(event, eventType) {

  if (event) event.preventDefault();

  const file = (eventType === 'change') ? event.target.files[0] : event.dataTransfer.files[0];

  return this.loadVideo(file);

};

Viewer.prototype.downloadSrt = function() {

  exportVideo(this.app.views.editor.getText(), srt => {

    const link = document.createElement('a');

    link.download = "subtitles.srt";
    link.href = "data:text/plain,"+encodeURIComponent(srt);

    link.click();

  });

};

Viewer.prototype.downloadVtt = function() {

  const link = document.createElement('a');

  link.download = "subtitles.vtt";
  link.href = "data:text/plain,"+encodeURIComponent(this.app.views.editor.getText());

  link.click();

};

Viewer.prototype.render = function() {

  this.app.on('rendered', () => this.initViewer());

  return h('div', [
      h('.modalbg', {id: 'openModal'}, h('.dialog', [
        h('a.close', {title: 'Close', href: '#close'}, '×'),
        h('h2', 'WebVTT (v0.1.0)'),
        h('p', 'This is an experiment for easily setting up subtitles to your videos on the fly. The idea came across after working on a personal project. I just wanted a quick and fast way to work with subtitles in my videos without having to install third party software for specific platforms and learning about them.'),
        h('p', ['The idea was just to stay at the text editor the most of the time. For that, you may use the provided ',
                h('span.shortcuts', [
                  'shortcuts',
                  h('div.shorcuts-help', [
                    h('p', [h('strong', '<Alt-SPACE>'), ' for toggling between Pausing/Resuming']),
                    h('p', [h('strong', '<Alt-F>'), ' for toggling between Full/Normal screen size']),
                    h('p', [h('strong', '<Alt-C>'), ' for toggling between Enabling/Disabling captions']),
                    h('p', [h('strong', '<Alt-Q>/<Alt-Shift-Q>'), ' for forwarding 1 sec back and forth']),
                    h('p', [h('strong', '<Alt-W>/<Alt-Shift-W>'), ' for forwarding 10 secs back and forth']),
                    h('p', [h('strong', '<Alt-E>/<Alt-Shift-E>'), ' for forwarding 1 min back and forth']),
                    h('p', [h('strong', '<Ctrl-SPACE-tm>'), ' for including a time mark 00:00:00.000']),
                    h('p', [h('strong', '<Ctrl-SPACE-tmf>'), ' for including a full time mark 00:00:00.000 --> 00:00:00.000'])
                  ])
                ]),
                ' to control the video player anytime you stay on the text editor.',
        ]),
        h('p.fineprint', h('a', {target:"_blank", href:'https://github.com/Tsur/webvtt'}, 'Made with ♡ by Zuri Pabón'))
      ])),
      h('.export', {attributes: {"tabindex": "0"} }, [
        h('img.icon', {src: './gear.svg'}),
        h('div',
            h('ul.gear-menu-content', [
              h('li', h('button.export-vtt', 'Export as vtt')),
              h('li', h('button.export-str', 'Export as str')),
              h('li.separator'),
              h('li', h('button.about', h('a', {href: "#openModal"}, 'About ...')))
            ]))
      ]),
      h('.overlay.plyr', [
        h('input.file', {
          type: 'file'
        }),
        h('p', 'DROP YOUR TUBE HERE'),
        h('input.youtube', {
          type: 'text',
          placeholder: 'Type your tube'
        }),
        h('video.hidden', {
          controls: true
        }, [h('source#ui-video-source')])
      ])
    ]);

};

export
default Viewer;
