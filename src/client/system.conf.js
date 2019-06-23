// set our baseURL reference path
System.config({
  baseURL: '/',
  packages: {
    '/': {
      defaultExtension: 'js',
    },
    dexie: {
      format: 'amd',
    }, // or 'cjs'
  },
  map: {
    debug: 'libs/debug.js',
  },
  paths: {
    three: 'libs/three.js',
    dexie: 'libs/dexie.js',
    debug: 'libs/debug.js',
    react: 'libs/react.js',
    'react-dom': 'libs/react-dom.js',
    chai: 'libs/chai.js',
  },
});
