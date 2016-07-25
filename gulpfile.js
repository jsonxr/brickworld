'use strict';

const gulp = require('gulp'),
      babel = require('gulp-babel'),
      cached = require('gulp-cached'),
      // concat = require('gulp-concat'),
      inject = require('gulp-inject'),
      print = require('gulp-print'),
      sass = require('gulp-sass'),
      sourcemaps = require('gulp-sourcemaps'),
      watch = require('gulp-watch'),
      browserSync = require('browser-sync'),
      del = require('del');

const PATHS = {
  // Compile JS files
  JS_CLIENT: {
    CACHE: 'js-client',
    SRC: 'src/client/**/*.js',
    DEST: 'dist/client'
  },

  JS_SERVER: {
    CACHE: 'js-server',
    SRC: 'src/server/**/*.js',
    DEST: 'dist/server'
  },

  // Just copy over to dist directory
  COPY: {
    CACHE: 'copy',
    SRC: [
      'src/**/*',              // ALL files not explicitly excluded
      '!src/**/*.js',          // All JS is transpiled
      '!src/**/*.scss',        // All scss is compiled to css
      '!src/client/index.html' // this is treated special for library includes
    ],
    DEST: 'dist'
  },

  // Compile SCSS
  SCSS: {
    CACHE: 'scss',
    SRC: 'src/client/**/*.scss',
    DEST: 'dist/client'
  },

  LIBS: {
    CACHE: 'libs',
    INJECT: [
      'three.js',
      '*.js',
      '!system.src.js' // This should not be included in the index.html
    ],
    SRC: [
      // This is used for importing modules
      'node_modules/systemjs/dist/system.js',
      'node_modules/systemjs/dist/system.js.map',
      'node_modules/systemjs/dist/system.src.js',

      // This is used for babel polyfill in browser
      // 'node_modules/babel-polyfill/dist/polyfill.js', <- Not needed for modern es6 browsers

      // this is the gl-matrix library for vectors and matrices
      'node_modules/gl-matrix/dist/gl-matrix.js',

      // Polyfill required for safari as no indication as to when they will support
      'node_modules/whatwg-fetch/fetch.js',

      // Three.js for rendering
      'node_modules/three/build/three.js',
      'node_modules/three/examples/js/Detector.js',
      'node_modules/three/examples/js/libs/stats.min.js',
      'node_modules/three/examples/js/libs/dat.gui.min.js',
      'node_modules/three/examples/js/controls/PointerLockControls.js'
    ],
    DEST: 'dist/client/libs'
  }
}

gulp.task('js', ['js-server', 'js-client']);

// Javascript compile...
gulp.task('js-server', () => {
  return gulp
    .src(PATHS.JS_SERVER.SRC)
    .pipe(cached(PATHS.JS_SERVER.CACHE))
    .pipe(print())
    .pipe(sourcemaps.init())
    .pipe(babel({
      plugins: [
        'transform-es2015-modules-commonjs',
        'transform-async-to-generator'
      ] 
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(PATHS.JS_SERVER.DEST));
});

// Javascript compile...
gulp.task('js-client', () => {
  return gulp
    .src(PATHS.JS_CLIENT.SRC)
    .pipe(cached(PATHS.JS_CLIENT.CACHE))
    .pipe(print())
    .pipe(sourcemaps.init())
    .pipe(babel({
      plugins: [
        'transform-es2015-modules-systemjs',
        'transform-async-to-generator'
      ] 
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(PATHS.JS_CLIENT.DEST));
});

// Transform es6 js files to dist
gulp.task('scss', function () {
  return gulp
    .src(PATHS.SCSS.SRC)
    .pipe(cached(PATHS.SCSS.CACHE))
    .pipe(print())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(PATHS.SCSS.DEST));
});

// Copy files to dist folder
gulp.task('copy', function() {
  return gulp
    .src(PATHS.COPY.SRC)
    .pipe(cached(PATHS.COPY.CACHE))
    .pipe(print())
    .pipe(gulp.dest(PATHS.COPY.DEST));
});

// Copy libraries used in the client app
gulp.task('libs', function () {
  return gulp
    .src(PATHS.LIBS.SRC)
    .pipe(cached(PATHS.LIBS.CACHE))
    .pipe(print())
    .pipe(gulp.dest(PATHS.LIBS.DEST));
});

// Create the index file with the injected libraries
gulp.task('index', ['libs', 'js'], function () {
  var libSrc = gulp.src(PATHS.LIBS.INJECT, {read: false, cwd: PATHS.LIBS.DEST});
  return gulp
    .src('src/client/index.html')
    .pipe(print())
    .pipe(inject(libSrc, {
      relative: true,
      ignorePath: '../../dist/client/',
      addRootSlash: false
    }))
    .pipe(gulp.dest('dist/client'));
});


gulp.task('build', ['js', 'libs', 'copy', 'scss', 'index']);

var serverSync = require('server-sync');

// watch files for changes and reload
gulp.task('serve', ['build'], function() {
  serverSync({
    script: 'dist/server'
  });

  browserSync({
    proxy: "localhost:3000",
    port: 8080
  });

  gulp.watch('**/*', {cwd: 'dist/client'}, browserSync.reload);
  gulp.watch('**/*.js', { cwd: 'dist/server' }, serverSync.reload);
  gulp.watch(PATHS.JS_CLIENT.SRC, ['js-client']);
  gulp.watch(PATHS.JS_SERVER.SRC, ['js-server']);
  gulp.watch(PATHS.COPY.SRC, ['copy']);
  gulp.watch(PATHS.SCSS.SRC, ['scss']);
  gulp.watch('src/client/index.html', ['index']);
});

gulp.task('clean', function () {
  return del(['dist']);
});

gulp.task('default', ['serve']);
