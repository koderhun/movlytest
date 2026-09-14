'use strict'

import gulp from 'gulp'
import favicons from 'gulp-favicons'
import {paths} from '../gulpfile.babel.js'

const faviconConfig = {
  appName: 'My App',
  appShortName: 'App',
  appDescription: 'My application',

  background: '#ffffff',
  theme_color: '#ffffff',

  icons: {
    favicons: true,
    appleIcon: true,

    appleStartup: false,
    android: false,
    windows: false,
    yandex: false,
  },
}

gulp.task('favicons-img', () =>
  gulp
    .src(paths.favicons.src)
    .pipe(favicons(faviconConfig))
    .pipe(gulp.dest(paths.favicons.dist)),
)

gulp.task('favicon-svg', () =>
  gulp
    .src('./src/assets/images/favicon.svg')
    .pipe(gulp.dest(paths.favicons.dist)),
)

gulp.task('favicons', gulp.parallel('favicons-img', 'favicon-svg'))
