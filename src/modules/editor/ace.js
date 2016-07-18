"use strict";

import {
  h
}
from 'virtual-dom';
import brace from 'brace';

require('brace/mode/css');
require('brace/theme/monokai');
require("brace/ext/language_tools");

function aceify(element, options) {

  let editor = brace.edit(element);
  let session = editor.getSession();

  function option(subject, name, defaultValue) {

    const setter = subject["set" + name[0].toUpperCase() + name.slice(1)];

    if (typeof(options[name]) != 'undefined') {

      setter.call(subject, options[name]);

    } else if (typeof(defaultValue) != 'undefined') {

      setter.call(subject, defaultValue);

    }

  }

  option(editor, 'displayIndentGuides', false);
  option(session, 'tabSize', 2);
  option(session, 'useSoftTabs', true);

  if (options.theme) {

    editor.setTheme("ace/theme/" + options.theme);

  }

  if (options.mode) {

    session.setMode("ace/mode/" + options.mode);

  }

  if (options.configure) {

    options.configure(editor);

  }

  // Snippets
  const langTools = brace.acequire("ace/ext/language_tools");

  langTools.setCompleters([]);

  editor.setOptions({enableBasicAutocompletion: true});

  const flowCompleter = {

      getCompletions: function(editor, session, pos, prefix, callback) {

        const completions = [];

        completions.push({value: "tm", score: 1000, snippet: "00:00:00.000", meta: "snippet"});

        completions.push({value: "tmf", score: 1000, snippet: "00:00:00.000 --> 00:00:00.000\n...", meta: "snippet"});

        callback(null, completions);

      }
  }

  langTools.addCompleter(flowCompleter);

  return editor;

}

export
default

function(self, options, element) {

  const editor = aceify(element, options);
  const eDocument = editor.getSession().getDocument();

  editor.getSession().setUseWorker(false);

  eDocument.setValue('WEBVTT FILE\n\n1\n00:00:01.000 --> 00:00:10.000\nThis is my first sub\n');

  eDocument.on('change', function() {

    self.app.emit('updatedVTT', eDocument.getValue());

  });

  return editor;

}
