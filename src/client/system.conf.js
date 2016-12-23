
// set our baseURL reference path
System.config({
  baseURL: '/',
  packages: {
    '/': {
      defaultExtension: 'js'
    },
    'dexie': {
      format: 'amd'
    } // or 'cjs'

  },
  paths: {
    'three': 'libs/three.js',
    'traceur': 'libs/traceur.js',
    'dexie': 'libs/dexie.js'
  },
});
