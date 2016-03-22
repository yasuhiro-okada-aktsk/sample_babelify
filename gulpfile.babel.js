import gulp from 'gulp';
import webserver from 'gulp-webserver';
import gutil from 'gulp-util';

import browserify from 'browserify';
import babelify from 'babelify';
import del from 'del';
import source from 'vinyl-source-stream';

const DIR_WEB = "web";
const DIR_DEST = "_dest";

gulp.task('html', () => {
  gulp.src([DIR_WEB + '/*.html'])
    .pipe(gulp.dest(DIR_DEST));
});

gulp.task('script', () => {
  let bundler = browserify({
    entries: [DIR_WEB + '/app/js/app.js'],
    paths: ['.', 'web'],
    debug: true,
    //insertGlobals: true,
    cache: {},
    packageCache: {},
    //fullPaths: true,
    transform: [babelify]
  });

  return bundler.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('app.js'))
    .pipe(gulp.dest(DIR_DEST + '/script'));
});

gulp.task('build', ['html', 'script']);

// Clean
gulp.task('clean', cb => {
  del.sync([DIR_DEST]);
  cb();
});

gulp.task('web', () => {
  gulp.src(DIR_DEST)
    .pipe(webserver({
      host: 'localhost',
      port: 8000,
      livereload: true,
      open: true
    }));
});

gulp.task('serv', ['build', 'web'], () => {
  gulp.watch([DIR_WEB + '/*.html'], ['html']);
  gulp.watch([DIR_WEB + '/app/js/**/*.js'], ['script']);

});

// Default task
gulp.task('default', ['clean', 'build']);
