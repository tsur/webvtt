"use strict";

import {
  inherits
}
from 'util';
import path from 'path';
import remote from 'remote';
import shell from 'shell';
import App from '../core/application';

const remoteApp = remote.require('app');
const browserWindow = remote.require('browser-window');
const currentWindow = remote.getCurrentWindow();

inherits(Desktop, App);

function Desktop() {

  if (!(this instanceof Desktop)) return new Desktop();

  const self = this;

  // clear notifications on focus. TODO: only clear notifications in current channel when we have that
  currentWindow.on('focus', function() {

    // self.setBadge(false);

  });

  // this.on('showHelp', this.showHelp.bind(this));

  // this.on('setBadge', this.setBadge.bind(this));

  this.on('openUrl', function(url) {

    shell.openExternal(url);

  });

  App.call(this, currentWindow);

}

// Desktop.prototype.showHelp = function() {

//   const helpURL = 'file://' + path.join(__dirname, '..', 'windows', 'help.html');

//   let helpWin = new BrowserWindow({

//     width: 600,
//     height: 525,
//     show: false,
//     center: true,
//     resizable: false

//   });

//   helpWin.on('closed', function() {

//     helpWin = null;

//   });

//   helpWin.loadUrl(helpURL);

//   helpWin.show();

// }

// Desktop.prototype.setBadge = function(num) {

//   if (!remoteApp.dock) return;

//   if (num === false) {

//     return remoteApp.dock.setBadge('');

//   } else if (num == null) {

//     this._notifications++;

//   } else {

//     this._notifications = num;
//   }

//   remoteApp.dock.setBadge(this._notifications.toString());

// }

export
default Desktop;