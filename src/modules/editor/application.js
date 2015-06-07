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

import ace from './ace';

inherits(Editor, EventEmitter);

function Editor(app) {

  this.app = app;

}

Editor.prototype.render = function(model) {

  this.app.on('rendered', () => {

    this.ace = ace(this, {
      theme: 'monokai',
      mode: 'css'
    }, 'ui-subcss-editor');

  });

  return h('#ui-subcss-editor', {
    key: 'ace'
  });

};

Editor.prototype.getText = function(model) {

  return this.ace.getValue();

};

export
default Editor;