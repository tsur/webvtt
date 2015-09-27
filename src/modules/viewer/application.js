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

import getYoutube from '../../node/youtube';

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

  this.overlayText = document.querySelector('.overlay p')
  this.input = document.querySelector('.overlay input.file');
  this.inputYoutube = document.querySelector('.overlay input.youtube');
  this.video = document.querySelector('.overlay video');
  this.overlay = document.querySelector('.overlay');
  this.videoSource = document.querySelector('#ui-video-source');

  this.video.setAttribute('crossorigin', 'anonymous');

  this.overlay.addEventListener('click', (e) => {

    if (e.target.tagName.toLowerCase() != 'input') this.input.click();

  });

  this.input.addEventListener('change', (e) => this.processVideoFile(e, 'change'));

  this.inputYoutube.addEventListener('keyup', (e) => {

    if (e.keyCode === 13 || e.which === 13) {

      getYoutube(this.inputYoutube.value, this.proxyUrl, (url) => {

        if (url) this.loadVideo({
          data: url
        });

      });
    }

  });

  this.video.addEventListener('playing', () => this.addSubtitles());

  this.app.on('updatedVTT', (text) => this.addSubtitles(text));

  this.overlay.addEventListener('drop', (e) => this.processVideoFile(e, 'drop'));

  this.overlay.addEventListener('dragover', processDragOverOrEnter);

  this.overlay.addEventListener('dragenter', processDragOverOrEnter);

  document.addEventListener('drop', (e) => e.preventDefault());

  document.addEventListener('dragover', (e) => e.preventDefault());

  document.addEventListener('dragenter', (e) => e.preventDefault());

};

Viewer.prototype.addSubtitles = function(text) {

  // Remove all track elements
  if (this.track) this.track.remove();

  this.track = document.createElement('track');

  this.track.setAttribute('src', this.convertToVTT(text || this.app.views.editor.getText()));
  this.track.setAttribute('srclang', 'en');
  this.track.setAttribute('default', true);

  this.video.appendChild(this.track);

};

Viewer.prototype.convertToVTT = function(src) {

  const utf8Tob64 = (str) => window.btoa(unescape(encodeURIComponent(str)));
  // const utf8Tob64 = (str) => window.btoa(str);

  return 'data:text/vtt;base64,' + utf8Tob64(src);

};

Viewer.prototype.loadVideo = function(file) {

  if (file.type) this.videoSource.setAttribute('type', file.type);

  this.videoSource.setAttribute('src', file.data);

  this.overlayText.classList.add('hidden');

  // this.video.setAttribute('width', (window.innerWidth * 0.7) - 80);
  // this.video.setAttribute('height', window.innerHeight - 80);

  this.video.classList.remove('hidden');

  this.inputYoutube.classList.add('hidden');

  this.video.load();
  // this.video.play();

};

Viewer.prototype.processVideoFile = function(event, eventType) {

  let file, name, reader, size, type;
  let self = this;

  if (event) event.preventDefault();

  file = (eventType === 'change') ? event.target.files[0] : event.dataTransfer.files[0];
  name = file.name;
  type = file.type;
  size = file.size;

  reader = new FileReader();

  reader.onload = (event) => {

    const file = {

      'data': event.target.result,
      'name': name,
      'size': size,
      'type': type

    };

    this.loadVideo(file);

  };

  reader.readAsDataURL(file);

  return false;

};

Viewer.prototype.render = function(model) {

  this.app.on('rendered', () => this.initViewer());

  return h('.overlay', [h('input.file', {
    type: 'file'
  }), h('p', 'DROP YOUR TUBE HERE'), h('input.youtube', {
    type: 'text',
    placeholder: 'Type your tube'
  }), h('video.hidden', {
    controls: true
  }, [h('source#ui-video-source')])]);

};

export
default Viewer;
