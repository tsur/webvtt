# WebVTT

A WebVTT experiment for setting up subtitles to your videos on the fly. A demo is available [here](http://tsur.github.io/webvtt). You may also build a desktop version based on [Electron](https://github.com/atom/electron).

The idea came across after working on a personal project. I just wanted a quick and fast way to work with subtitles in my videos without having to install third party software for specific platforms and learning about them, and be able to stay at the text editor the most of the time. For that, you may use the provided shortcuts to control the video player anytime you stay on the text editor.

```
<Ctrl-Alt-SPACE> for toggling between Pausing/Resuming
<Ctrl-Alt-F> for toggling between Full/Normal screen size
<Ctrl-Alt-C> for toggling between Enabling/Disabling captions
<Ctrl-Alt-Q>/<Alt-Shift-Q> for forwarding 1 sec back and forth
<Ctrl-Alt-W>/<Alt-Shift-W> for forwarding 10 secs back and forth
<Ctrl-Alt-E>/<Alt-Shift-E> for forwarding 1 min back and forth
```

Once it's done, export it to a `.srt` file and add it to your third party player software as VLC to use it.

# Setting up

To deploy it on your local machine, just follow the steps below:

```bash
git clone https://github.com/Tsur/webvtt.git && cd webvtt && npm install
npm run start:web
```
Point now your browser on localhost:8080 to play it. If you wanna try the desktop version, just run:

```bash
npm run start:desktop
```

In case you also want to use tubes, run first the streaming proxy server:

```bash
npm run start:tubeproxy
```

To deploy remotely, make sure you commit and/or push all your changes to the develop branch. Once your done, run:

```bash
# Github Pages (first time you need to create it: git checkout -b gh-pages develop)
npm run deploy:gh-pages
```

# Building

Once you have ended adding new features, fixing issues or refactoring code, just build the project:

```bash
npm run build:web
```

If the command above was ok, the bundle.js file have been now generated under the dist folder.

# Testing

```bash
npm run test
```
# Youtube captions

It is currently limited to videos 5 minutes long. Reasons are listed below.

- Whammy.js and webm video files have issues in chrome, it does not work anymore from verison 50+
- Chromium has a known bug with pause/play video html5 methods (https://bugs.chromium.org/p/chromium/issues/detail?id=593273)

Therefore, a new approach is needed as for instance composing empty video client-side with ffmeg.js (https://github.com/Kagami/ffmpeg.js). This is slow though.

# Changelog

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### WIP
- Youtube captions unlimited support

## [0.2.0] - 2017-03-15
### Added
- Youtube captions support (up to 5 minutes)
- Youtube collaboration support

## [0.1.0] - 2016-07-17
### Added
- Video player keyboard controls:
    ```
    <Alt-SPACE> for toggling between Pausing/Resuming
    <Alt-F> for toggling between Full/Normal screen size
    <Alt-C> for toggling between Enabling/Disabling captions
    <Alt-Q>/<Alt-Shift-Q> for forwarding 1 sec back and forth
    <Alt-W>/<Alt-Shift-W> for forwarding 10 secs back and forth
    <Alt-E>/<Alt-Shift-E> for forwarding 1 min back and forth
    ```
- Custom snippets:
    ```
    <Alt-SPACE-tm> for including a time mark 00:00:00.000
    <Alt-SPACE-tmf> for including a full time mark 00:00:00.000 --> 00:00:00.000
    ```
- Settings button with next features:
    export as vtt
    export as str
    about

### Fixed
- Select video again if any was selected (input file dialog was cancelled)
- Wrapping text width into the editor
