// Karma configuration
// Generated on Thu Nov 24 2016 10:23:24 GMT-0700 (MST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['systemjs', 'mocha'],

    systemjs: {
      baseURL: '/',
      packages: {
        '/': {
          defaultExtension: 'js'
        }
      },
      files: ['src/**/*.js']
    },

    // list of files / patterns to load in the browser
    files: [
      //{pattern: 'node_modules/systemjs/dist/system.js', included: true},
      {pattern: 'src/**/*.js', included: false},
      {pattern: 'node_modules/chai/chai.js', included: false},
      {pattern: 'test/lib/karma-test-shim.js', included: true},
      {pattern: 'test/shared/*-spec.js', included: true},
      {pattern: 'test/client/*-spec.js', included: true},
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
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
