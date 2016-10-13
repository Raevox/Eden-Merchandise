'use strict';

const path = require('path');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const es = require('event-stream');
const srcMaps = require('gulp-sourcemaps');
const gutil = require('gulp-util');
const gren = require('gulp-rename');
const sass = require('gulp-sass');
const browserify = require('browserify');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();

const styleSources = [
  path.join(__dirname, 'app/styles/app.scss'),
  path.join(__dirname, 'app/styles/lib/*.scss')
];

const scriptSources = [
  './app/scripts/app.js',
  './app/scripts/shoppingCart.js',
  './app/scripts/map.js'
];

const fontSources = [
  path.join(__dirname, 'node_modules/font-awesome/fonts/*')
];

gulp.task('styles', () => {
  const sassConfig = {
    includePaths: [
      require('node-bourbon').includePaths,
      path.join(__dirname, 'node_modules/tether/dist/css'),
      path.join(__dirname, 'node_modules/bootstrap/scss'),
      path.join(__dirname, 'node_modules/font-awesome/scss')
    ]
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

  const tasks = scriptSources.map(entry => {
    return browserify({
      entries: [ entry ],
      debug: true
    }).bundle()
        .on('error', gutil.log)
      .pipe(source(entry))
      .pipe(buffer())
      .pipe(srcMaps.init({ loadMaps: true }))
        .pipe(babel(babelConfig))
        .on('error', gutil.log)
      .pipe(srcMaps.write())
      .pipe(gren({ dirname: '', extname: '.bundle.js' }))
      .pipe(gulp.dest(path.join(__dirname, 'dist/scripts')));
  });

  return es.merge.apply(null, tasks);
});

gulp.task('fonts', () => {
  return gulp.src(fontSources)
    .pipe(gulp.dest(path.join(__dirname, 'dist/fonts')));
});

gulp.task('build', [ 'styles', 'scripts', 'fonts' ]);

gulp.task('serve', [ 'build' ], () => {
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

gulp.task('default', [ 'watch' ]);
