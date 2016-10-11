'use strict';

const path = require('path');
const gulp = require('gulp');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const srcMaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const browserify = require('browserify');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();

const styleSources = [
  path.join(__dirname, 'app/styles/app.scss'),
  path.join(__dirname, 'app/styles/lib/*.scss')
];

const scriptSources = [
  path.join(__dirname, 'app/scripts/app.js')
];

gulp.task('styles', () => {
  const sassConfig = {
    includePaths: []
  };

  return gulp.src(styleSources)
    .pipe(srcMaps.init({ loadMaps: true }))
    .pipe(sass(sassConfig).on('error', sass.logError))
    .pipe(srcMaps.write())
    .pipe(gulp.dest(path.join(__dirname, 'dist/styles')))
    .pipe(browserSync.stream());
});

gulp.task('scripts', () => {
  const babelConfig = {
    presets: [ 'es2015' ]
  };

  const browserifyBundle = browserify({
    entries: './app/scripts/app.js',
    debug: true
  });

  return browserifyBundle.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(srcMaps.init({ loadMaps: true }))
    .pipe(babel(babelConfig))
    .pipe(srcMaps.write())
    .pipe(gulp.dest(path.join(__dirname, 'dist/scripts')));
});

gulp.task('serve', [ 'styles', 'scripts' ], () => {
  browserSync.init({
    server: {
      baseDir: path.join(__dirname, 'dist')
    }
  });
});

gulp.task('reload', done => {
  browserSync.reload();
  done();
});

gulp.task('watch:scripts', [ 'scripts' ], done => {
  browserSync.reload();
  done();
});

gulp.task('watch', [ 'serve' ], () => {
  gulp.watch(styleSources, [ 'styles' ]);
  gulp.watch(scriptSources, [ 'watch:scripts' ]);
  gulp.watch(path.join(__dirname, 'dist/*.html'), [ 'reload' ]);
});

gulp.task('build', [ 'styles', 'scripts' ]);
gulp.task('default', [ 'watch' ]);
