/* eslint import/no-extraneous-dependencies: "off" */

const babel = require('gulp-babel');
// const browserSync = require('browser-sync');
const changed = require('gulp-changed');
const debug = require('gulp-debug');
const del = require('del');
const gulp = require('gulp');
const inject = require('gulp-inject');
const jsdoc = require('gulp-jsdoc3');
const path = require('path');
const sass = require('gulp-sass');
const server = require('gulp-develop-server');
const sourceMaps = require('gulp-sourcemaps');

const JS_CLIENT = [
  'src/client/**/*.js',
];

const COPY_SRC = [
  'src/**/*',               // ALL files not explicitly excluded
  '!src/**/*.js',           // All JS is transpiled
  '!src/**/*.scss',         // All scss is compiled to css
  '!src/client/index.html', // this is treated special for library includes
];

const LIBS_SRC = [
  // This is used for importing modules
  'node_modules/systemjs/dist/system.js',
  'node_modules/systemjs/dist/system.js.map',

  // this is the gl-matrix library for vectors and matrices
  'node_modules/gl-matrix/dist/gl-matrix.js',

  // Polyfill required for safari as no indication as to when they will support
  'node_modules/whatwg-fetch/fetch.js',

  // Three.js for rendering
  'node_modules/three/build/three.js',
  'node_modules/three/examples/js/Detector.js',
  'node_modules/three/examples/js/libs/stats.min.js',
  'node_modules/three/examples/js/libs/dat.gui.min.js',
];

// Javascript compile...
gulp.task('js-server', () => gulp.src('src/**/*.js')
  .pipe(changed('dist'))
  .pipe(debug())
  .pipe(sourceMaps.init())
  .pipe(babel())
  .pipe(sourceMaps.write('.'))
  .pipe(gulp.dest('dist'))
);

// // Javascript compile...
// gulp.task('js-client', () => gulp.src(JS_CLIENT)
//   .pipe(changed('dist/client'))
//   .pipe(debug())
//   .pipe(sourceMaps.init())
//   .pipe(babel())
//   .pipe(sourceMaps.write('.'))
//   .pipe(gulp.dest('dist/client'))
// );

// Transform es6 js files to dist
gulp.task('scss', () => gulp.src('src/client/**/*.scss')
  .pipe(changed('dist/client'))
  .pipe(debug())
  .pipe(sourceMaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(sourceMaps.write())
  .pipe(gulp.dest('dist/client'))
);

// Copy files to dist folder
gulp.task('copy', () => gulp.src(COPY_SRC)
  .pipe(changed('dist'))
  .pipe(debug())
  .pipe(gulp.dest('dist'))
);

// Copy libraries used in the client app
gulp.task('libs', () => gulp.src(LIBS_SRC)
  .pipe(changed('dist/client/libs'))
  .pipe(debug())
  .pipe(gulp.dest('dist/client/libs'))
);

// Create the index file with the injected libraries
gulp.task('index', () => gulp.src('src/client/index.html')
    .pipe(debug())
    .pipe(inject(gulp.src(LIBS_SRC, { read: false }), {
      name: 'vendor',
      transform: (filepath) => {
        switch (path.extname(filepath)) {
          case '.css':
            return `<link rel="stylesheet" href="libs/${path.basename(filepath)}">`;
          case '.js':
            return `<script src="libs/${path.basename(filepath)}"></script>`;
          default:
            return '';
        }
      },
    }))
    .pipe(gulp.dest('dist/client'))
);

gulp.task('js', gulp.parallel(['js-server'/*, 'js-client'*/]));

gulp.task('build', gulp.series(
  gulp.parallel([
    'js',
    'libs',
    'copy',
    'scss',
  ]),
  'index'
));

// watch files for changes and reload
gulp.task('serve', () => {
  server.listen({
    env: { PORT: 3000, NODE_ENV: 'development' },
    path: 'dist/server',
    execArgs: process.argv.slice(2) });

  // browserSync({
  //   proxy: 'localhost:8080',
  //   port: 3000,
  // });

  //gulp.watch(['src/client/**/*.js'], gulp.series(['js-client']));
  gulp.watch('src/**/*.js', gulp.series(['js-server']));
  //gulp.watch('dist/client/**/*', browserSync.reload);
  gulp.watch('dist/server/**/*.js', server.restart);
  gulp.watch(COPY_SRC, gulp.series(['copy']));
  gulp.watch('src/client/**/*.scss', gulp.series(['scss']));
  gulp.watch('src/client/index.html', gulp.series(['index']));
});

gulp.task('docs', (callback) => {
  /** Generates JSDoc documentation */
  const config = {
    opts: {
      destination: 'dist/docs',
    },
  };

  return gulp.src([
    'README.md',
    './src/**/*.js',
  ], { read: false })
    .pipe(jsdoc(config, callback));
});

gulp.task('clean', () => {
  return del(['dist']);
});

gulp.task('default', gulp.series(['build', 'serve']));
