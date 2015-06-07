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

inherits(Viewer, EventEmitter);

function Viewer(app) {

  this.app = app;

}

Viewer.prototype.initViewer = function() {

  const processDragOverOrEnter = function(event) {

    if (event) event.preventDefault();

    event.dataTransfer.effectAllowed = 'copy';

    return false;

  };

  this.overlayText = document.querySelector('.overlay p')
  this.input = document.querySelector('.overlay input');
  this.video = document.querySelector('.overlay video');
  this.overlay = document.querySelector('.overlay');
  this.videoSource = document.querySelector('#ui-video-source');

  this.video.setAttribute('crossorigin', 'anonymous');

  this.overlay.addEventListener('click', (e) => this.input.click());

  this.input.addEventListener('change', (e) => this.processVideoFile(e, 'change'));

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

Viewer.prototype.processVideoFile = function(event, eventType) {

  let file, name, reader, size, type;
  let self = this;

  const loadVideo = function(file) {

    self.videoSource.setAttribute('type', file.type);
    self.videoSource.setAttribute('src', file.data);

    self.overlayText.classList.add('hidden');

    // self.video.setAttribute('width', (window.innerWidth * 0.7) - 80);
    // self.video.setAttribute('height', window.innerHeight - 80);

    self.video.classList.remove('hidden');

    self.video.load();
    // self.video.play();

  };

  if (event) event.preventDefault();

  file = (eventType === 'change') ? event.target.files[0] : event.dataTransfer.files[0];
  name = file.name;
  type = file.type;
  size = file.size;

  reader = new FileReader();

  reader.onload = function(event) {

    const file = {

      'data': event.target.result,
      'name': name,
      'size': size,
      'type': type

    };

    loadVideo(file);

  };

  reader.readAsDataURL(file);

  return false;

};

Viewer.prototype.render = function(model) {

  this.app.on('rendered', () => this.initViewer());

  return h('.overlay', [h('input', {
    type: 'file'
  }), h('p', 'DROP YOUR TUBE HERE'), h('video.hidden', {
    controls: true
  }, [h('source#ui-video-source')])]);

};

export
default Viewer;