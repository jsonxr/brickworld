'use strict';

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
  map: {
    'debug': 'libs/debug.js'
  },
  paths: {
    'three': 'libs/three.js',
    'traceur': 'libs/traceur.js',
    'dexie': 'libs/dexie.js',
    'debug': 'libs/debug.js',
    'chai': 'libs/chai.js'
  },
});
