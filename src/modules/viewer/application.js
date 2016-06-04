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
  this.exportBtn = document.querySelector('.export');

  this.video.setAttribute('crossorigin', 'anonymous');

  const overlayClickEvent = event => {

    this.overlay.removeEventListener('click', overlayClickEvent);

    if (event.target.tagName.toLowerCase() != 'input') this.input.click();

  };

  this.overlay.addEventListener('click', overlayClickEvent);
  this.exportBtn.addEventListener('click', event => this.download());

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

  this.player.captions(this.convertToVTT(text || this.app.views.editor.getText()));

};

Viewer.prototype.convertToVTT = function(src) {

  const utf8Tob64 = (str) => window.btoa(unescape(encodeURIComponent(str)));
  // const utf8Tob64 = (str) => window.btoa(str);

  return 'data:text/vtt;base64,' + utf8Tob64(src);

};

Viewer.prototype.loadVideo = function(file) {

  this.overlayText.classList.add('hidden');
  this.video.classList.remove('hidden');
  this.inputYoutube.classList.add('hidden');
  this.player = plyr.setup(this.overlay, {captions:{defaultActive: true}})[0];

  const videoType = file.type ? file.type : 'video/mp4';
  const src = file.url ? {src: file.id, type: 'youtube'} : {src: window.URL.createObjectURL(file), type: videoType};
  //const src = file.url ? {src: file.url, type: videoType} : {src: window.URL.createObjectURL(file), type: videoType};

  this.player.source({
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

};

Viewer.prototype.processVideoFile = function(event, eventType) {

  if (event) event.preventDefault();

  const file = (eventType === 'change') ? event.target.files[0] : event.dataTransfer.files[0];

  return this.loadVideo(file);

};

Viewer.prototype.download = function() {

  exportVideo(this.app.views.editor.getText(), srt => {

    const link = document.createElement('a');

    link.download = "subtitles.srt";
    link.href = "data:text/plain,"+encodeURIComponent(srt);

    link.click();

  });

};

Viewer.prototype.render = function() {

  this.app.on('rendered', () => this.initViewer());

  return h('div', [
      h('.export', [h('img.icon', {src: './export.svg'})]),
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
