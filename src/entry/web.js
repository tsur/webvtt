"use strict";

import {
  inherits
}
from 'util';

import App from '../core/application';

inherits(Web, App)

function Web() {

  if (!(this instanceof Web)) return new Web();

  App.call(this);

  this.on('openUrl', function(url) {

    window.open(url);

  });

}

Web();