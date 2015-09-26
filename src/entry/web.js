"use strict";

import {
  inherits
}
from 'util';

import App from '../core/application';

const proxyUrl = "http://localhost:8989";

inherits(Web, App);

function Web() {

  if (!(this instanceof Web)) return new Web();

  App.call(this, null, proxyUrl);

  this.on('openUrl', function(url) {

    window.open(url);

  });

}

Web();
