'use strict'

import {paths} from '../gulpfile.babel'
import gulp from 'gulp'
import debug from 'gulp-debug'
import ghPages from 'gulp-gh-pages'

gulp.task('predeploy', () => {
  return gulp
    .src(paths.deploy.src)
    .pipe(
      ghPages({
        remoteUrl: 'https://github.com/koderhun/movlytest.git',
        branch: 'gh-pages',
        cacheDir: '.publish',
      }),
    )
    .pipe(
      debug({
        title: 'Deploy',
      }),
    )
})

gulp.task('deploy', gulp.series('predeploy'))
