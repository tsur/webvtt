"use strict";

import {
  EventEmitter
}
from 'events';

import {
  inherits
}
from 'util';

import delegate from 'delegate-dom';
import {
  diff, path, h
}
from 'virtual-dom';

import createElement from 'virtual-dom/create-element';

import Editor from '../modules/editor/application';
import Viewer from '../modules/viewer/application';

inherits(App, EventEmitter);

function App(currentWindow, proxyUrl) {

  if (!(this instanceof App)) return new App(currentWindow);

  this.init(currentWindow, proxyUrl);

}

App.prototype.init = function(currentWindow, proxyUrl) {

  this.currentWindow = currentWindow;
  this._notifications = 0;

  // Open links in user's default browser
  delegate.on(document.body, 'a', 'click', (a) => {

    const href = a.target.getAttribute('href');

    if (/^https?:/.test(href)) {

      a.preventDefault();

      this.emit('openUrl', href);

    }

  });

  const self = this;

  // Views
  this.views = {

    editor: new Editor(self),
    viewer: new Viewer(self, proxyUrl)

  }

  // Initial DOM tree render
  let tree = this.render();
  let rootNode = createElement(tree);

  document.body.appendChild(rootNode);


  this.on('render', () => {

    const newTree = this.render();
    const patches = diff(tree, newTree);

    rootNode = patch(rootNode, patches);

    tree = newTree;

  });

  this.emit('rendered');

}

App.prototype.render = function(model) {

  const views = this.views;

  return h('main', {
    key: 'main'
  }, [
    h('section.ui-block', {
      key: 's-editor'
    }, views.editor.render()),
    h('section.ui-block', {
      key: 's-viewer'
    }, views.viewer.render())
  ]);

}

window.App = App;

export
default App;
