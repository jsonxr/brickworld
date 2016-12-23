
// set our baseURL reference path
System.config({
  baseURL: '/',
  packages: {
    '/': {
      defaultExtension: 'js'
    }
  },
  paths: {
    'three': 'libs/three.js',
    'traceur': 'libs/traceur.js'
  },
});
