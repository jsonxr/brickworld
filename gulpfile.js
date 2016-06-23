'use strict';

const gulp = require('gulp'),
      babel = require('gulp-babel'),
      cached = require('gulp-cached'),
      inject = require('gulp-inject'),
      print = require('gulp-print'),
      sass = require('gulp-sass'),
      sourcemaps = require('gulp-sourcemaps'),
      watch = require('gulp-watch'),
      browserSync = require('browser-sync'),
      del = require('del'),
      reload = browserSync.reload;

//const concat = require('gulp-concat');

// Transform es6 js files to dist
const SRC_JS = ['src/client/**/*.js'];
gulp.task('js', function () {
  return gulp
    .src(SRC_JS)
    .pipe(cached('js'))
    .pipe(print())
    .pipe(sourcemaps.init())
    .pipe(babel({
      // presets: ['es2015'], <- this is not required in es6 browsers  If es5 desired, include: "babel-preset-es2015": "^6.9.0" in package.json,

      // This is required because import not yet supported in any browsers. webpack 2 might...
      plugins: ['transform-es2015-modules-systemjs'] 
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/client'));
});

const SRC_SCSS = ['src/client/**/*.scss'];
gulp.task('scss', function () {
  return gulp
    .src(SRC_SCSS)
    .pipe(cached('scss'))
    .pipe(print())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/client'));
});

// Copy files to dist
const SRC_COPY = [
  'src/client/**/*',
  '!src/client/**/*.js',
  '!src/client/**/*.scss',
  '!src/client/index.html'];
gulp.task('copy', function() {
  return gulp
    .src(SRC_COPY)
    .pipe(cached('html'))
    .pipe(print())
    .pipe(gulp.dest('dist/client'));
});

// Create the index file with the injected libraries
gulp.task('index', ['libs'], function () {  
  var libSrc = gulp.src('dist/client/libs/*.js', {read: false});

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

// Copy libraries used in the client app
gulp.task('libs', function () {
  return gulp
    .src([
      // This is used for importing modules
      'node_modules/systemjs/dist/system.js',

      // This is used for babel polyfill in browser
      // 'node_modules/babel-polyfill/dist/polyfill.js', <- Not needed for modern es6 browsers

      // this is the gl-matrix library for vectors and matrices
      'node_modules/gl-matrix/dist/gl-matrix.js',

      // "twgl.js": "^1.7.1" - Thin wrapper around webgl
      // 'node_modules/twgl.js/dist/twgl.js', <- No math classes
      'node_modules/twgl.js/dist/twgl-full.js',

      // Polyfill required for safari as no indication as to when they will support
      'node_modules/whatwg-fetch/fetch.js',

      // Polyfill to use standard api
      'node_modules/fullscreen-api-polyfill/fullscreen-api-polyfill.js'
    ])
    .pipe(print())
    .pipe(gulp.dest('dist/client/libs'));
});

gulp.task('build', ['js', 'libs', 'copy', 'scss', 'index']);

// watch files for changes and reload
gulp.task('serve', ['build'], function() {
  browserSync({
    server: {
      baseDir: 'dist/client'
    }
  });

  gulp.watch('**/*', {cwd: 'dist/client'}, reload);
  gulp.watch(SRC_JS, ['js']);
  gulp.watch(SRC_COPY, ['html']);
  gulp.watch(SRC_SCSS, ['scss']);
  gulp.watch('src/client/index.html', ['index']);
});

gulp.task('clean', function () {
  return del(['dist']);
});

gulp.task('default', ['serve']);
