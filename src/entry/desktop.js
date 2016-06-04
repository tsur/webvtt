"use strict";

import {
  inherits
}
from 'util';
import path from 'path';
import remote from 'remote';
import shell from 'shell';
import App from '../core/application';

//@TODO: remove the server as it's actually not needed in electron but just the functionality provided by the server
import proxyServer from '../node/proxy.js';
const proxyUrl = "http://localhost:8000";
const currentWindow = remote.getCurrentWindow();

inherits(Desktop, App);

function Desktop() {

  if (!(this instanceof Desktop)) return new Desktop();

  // clear notifications on focus. TODO: only clear notifications in current channel when we have that
  currentWindow.on('focus', function() {

    // self.setBadge(false);

  });

  this.on('openUrl', function(url) {

    shell.openExternal(url);

  });

  App.call(this, currentWindow, proxyUrl);

}

export
default Desktop;
