'use strict';
import { paths } from '../gulpfile.babel';
import gulp from 'gulp';
import webp from 'gulp-webp';
import newer from 'gulp-newer';
import debug from 'gulp-debug';
import browsersync from 'browser-sync';
import yargs from 'yargs';

const argv = yargs.argv,
  production = !!argv.production;

gulp.task('webp', () => {
  return gulp
    .src(paths.images.src)
    .pipe(newer(paths.images.dist))
    .pipe(webp())
    .pipe(gulp.dest(paths.images.dist))
    .pipe(
      debug({
        title: 'Images',
      }),
    )
    .on('end', browsersync.reload);
});
