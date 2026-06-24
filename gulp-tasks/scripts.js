'use strict'

import {paths} from '../gulpfile.babel'
import webpack from 'webpack'
import webpackStream from 'webpack-stream'
import gulp from 'gulp'
import gulpif from 'gulp-if'
import rename from 'gulp-rename'
import browsersync from 'browser-sync'
import debug from 'gulp-debug'
import yargs from 'yargs'
import concat from 'gulp-concat'
import terser from 'gulp-terser'

gulp.task('bundle', () => {
  return gulp
    .src([
      './node_modules/jquery/dist/jquery.min.js',
      './node_modules/swiper/swiper-bundle.min.js',
    ])
    .pipe(concat('bundle.min.js'))
    .pipe(terser())
    .pipe(gulp.dest(paths.scripts.dist))
    .pipe(
      debug({
        title: 'JS files',
      }),
    )
    .on('end', browsersync.reload)
})

gulp.task('script-copy', () => {
  return (
    gulp
      .src(paths.scripts.src)
      // .pipe(terser())
      .pipe(gulp.dest(paths.scripts.dist))
      .pipe(
        debug({
          title: 'Copy Scripts',
        }),
      )
  )
})

gulp.task('scripts', gulp.series('bundle', 'script-copy'))
