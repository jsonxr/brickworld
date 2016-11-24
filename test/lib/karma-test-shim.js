// Adapted from http://twofuckingdevelopers.com/2016/01/testing-angular-2-with-karma-and-jasmine/

// Tun on full stack traces in errors to help debugging
Error.stackTraceLimit = Infinity;

//jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

// // Cancel Karma's synchronous start,
// // we will call `__karma__.start()` later, once all the specs are loaded.
//__karma__.loaded = function() {};

System.config({
  baseURL: '/',

  packages: {
    '/': {
      defaultExtension: 'js'
    }
  },

  map: {
    chai: 'https://cdnjs.cloudflare.com/ajax/libs/chai/3.5.0/chai.min.js'
  }
});
