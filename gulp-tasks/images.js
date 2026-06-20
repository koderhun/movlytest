'use strict';

import { paths } from '../gulpfile.babel';
import gulp from 'gulp';
import gulpif from 'gulp-if';
import image from 'gulp-image';
import newer from 'gulp-newer';
import debug from 'gulp-debug';
import browsersync from 'browser-sync';
import yargs from 'yargs';

const argv = yargs.argv,
  production = !!argv.production;

gulp.task('images', () => {
  return gulp
    .src(paths.images.src)
    .pipe(newer(paths.images.dist))
    .pipe(
      gulpif(
        production,
        image({
          pngquant: true,
          optipng: false,
          zopflipng: true,
          jpegRecompress: false,
          mozjpeg: true,
          gifsicle: true,
          svgo: true,
          concurrent: 10,
          quiet: true, // defaults to false
        }),
      ),
    )
    .pipe(gulp.dest(paths.images.dist))
    .pipe(
      debug({
        title: 'Images',
      }),
    )
    .on('end', browsersync.reload);
});
