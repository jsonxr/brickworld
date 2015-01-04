var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('-dependencies-gl-matrix', function () {
  return gulp.src([
    'node_modules/gl-matrix/dist/gl-matrix.js',
    'build/gl-matrix-es6-append.js'
  ])
    .pipe(concat({path: 'gl-matrix.js'}))
    .pipe(gulp.dest('public/game-engine/vendor'))

});

gulp.task('dependencies', ['-dependencies-gl-matrix']);
