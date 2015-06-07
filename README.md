# WebVTT 

A WebVTT experiment for setting up subtitles to your videos on the fly. A demo is available [here](http://tsur.github.io/webvtt). You may also build a desktop version based on [Electron](https://github.com/atom/electron).

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
