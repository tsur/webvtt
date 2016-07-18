/*****************************************************
 _______           ______   _______  _______  _______
(  ____ \|\     /|(  ___ \ (  ____ \(  ____ \(  ____ \
| (    \/| )   ( || (   ) )| (    \/| (    \/| (    \/
| (_____ | |   | || (__/ / | |      | (_____ | (_____
(_____  )| |   | ||  __ (  | |      (_____  )(_____  )
      ) || |   | || (  \ \ | |            ) |      ) |
/\____) || (___) || )___) )| (____/\/\____) |/\____) |
\_______)(_______)|/ \___/ (_______/\_______)\_______)

*****************************************************/

"use strict";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
const {app} = require('electron'); // Module to control application life.
const {BrowserWindow} = require('electron'); // Module to create native browser window.
var path = require('path');

var mainWindow = null;
var appName = 'WebVTT';
var index = 'file://' + path.join(__dirname, 'index.html')

// Report crashes to our server.
// require('crash-reporter').start();

// Adds useful debug features
// require('electron-debug')();

// Quit when all windows are closed.
app.on('ready', appReady);
// app.on('window-all-closed', function() {

//   if (process.platform != 'darwin') app.quit();

// });

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
function appReady() {

  // Create the browser window, .
  mainWindow = new BrowserWindow({

    width: 800,
    height: 600,
    title: appName,
    center: true

  });

  // and load the index.html of the app.
  mainWindow.loadURL(index);

  // Open the devtools.
  mainWindow.openDevTools();

  // Maximize
  mainWindow.maximize();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {

    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;

  });

}
