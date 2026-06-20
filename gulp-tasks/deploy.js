'use strict';

import { paths } from '../gulpfile.babel';
import gulp from 'gulp';
import debug from 'gulp-debug';
import ghPages from 'gulp-gh-pages';

gulp.task('predeploy', () => {
  return gulp
    .src(paths.deploy.src)
    .pipe(ghPages())
    .pipe(
      debug({
        title: 'Deploy',
      }),
    );
});

gulp.task('deploy', gulp.series('predeploy'));
