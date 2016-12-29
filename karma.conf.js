// Karma configuration
// Generated on Thu Nov 24 2016 10:23:24 GMT-0700 (MST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    //plugins: ['karma-systemjs'],
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['systemjs', 'mocha'],

    systemjs: {
      baseURL: '/',
      configFile: 'src/client/system.conf.js',
      config: {
        paths: {
          'systemjs': 'node_modules/systemjs/dist/system.js',
          'system.js.map': 'node_modules/systemjs/dist/system.js.map',
          'traceur': 'node_modules/traceur/dist/commonjs/traceur.js',
          //'systemjs': 'node_modules/systemjs/dist/system.js',
          'three': 'node_modules/three/build/three.min.js',
          'chai': 'node_modules/chai/chai.js',
          //'chai': 'https://cdnjs.cloudflare.com/ajax/libs/chai/3.5.0/chai.min.js'
        }
      },
      // map: {
      //   'systemjs': 'node_modules/systemjs/dist/system.js',
      //   'three.js': 'node_modules/three/build/three.min.js',
      //   // 'plugin-babel': 'node_modules/systemjs-plugin-babel/plugin-babel.js',
      //   // 'systemjs-babel-build': 'node_modules/systemjs-plugin-babel/systemjs-babel-browser.js',
      //   // 'system-polyfills': 'node_modules/systemjs/dist/system-polyfills.js',
      //   // 'es6-module-loader': 'node_modules/es6-module-loader/dist/es6-module-loader.js',
      //   'chai': 'https://cdnjs.cloudflare.com/ajax/libs/chai/3.5.0/chai.min.js'
      // },
      //files: [{ pattern: 'src/**/*.js', included: false }]
    },

    // list of files / patterns to load in the browser
    files: [
      //{pattern: 'node_modules/systemjs/dist/system.js', included: true},
      {pattern: 'node_modules/three/build/three.min.js', included: false},
      {pattern: 'src/**/*.js', included: false},
      {pattern: 'src/**/*.json', included: false},
      {pattern: 'node_modules/chai/chai.js', included: false},
//      {pattern: 'test/lib/karma-test-shim.js', included: true},
      {pattern: 'test/shared/*.spec.js', included: true},
      {pattern: 'test/client/*.spec.js', included: true},
      //{pattern: 'test/client/**/*-spec.js', included: true},
    ],


    // list of files to exclude
    exclude: [
    ],

    // // proxied base paths
    // proxies: {
    //   // required for component assests fetched by Angular's compiler
    //   '/src/': '/base/src/'
    // },


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.js': ['babel'],
      'test/**/*.js': ['babel']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [
      'progress',
      'coverage'
    ],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      'Chrome',
    //  'PhantomJS'
    ],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
}
