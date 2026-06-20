'use strict'

import {paths} from '../gulpfile.babel'
import gulp from 'gulp'
import realFavicon from 'gulp-real-favicon'
import fs from 'fs'
const FAVICON_DATA_FILE = paths.favicons.data

gulp.task('favicons-img', (done) => {
  realFavicon.generateFavicon(
    {
      masterPicture: paths.favicons.src,
      dest: paths.favicons.dist,
      iconsPath: paths.favicons.forHtmlPath,
      design: {
        ios: {
          pictureAspect: 'noChange',
          assets: {
            ios6AndPriorIcons: false,
            ios7AndLaterIcons: false,
            precomposedIcons: false,
            declareOnlyDefaultIcon: true,
          },
        },
        desktopBrowser: {},
        windows: {
          pictureAspect: 'noChange',
          backgroundColor: '#da532c',
          onConflict: 'override',
          assets: {
            windows80Ie10Tile: false,
            windows10Ie11EdgeTiles: {
              small: false,
              medium: true,
              big: false,
              rectangle: false,
            },
          },
        },
        androidChrome: {
          pictureAspect: 'noChange',
          themeColor: '#ffffff',
          manifest: false,
          assets: {
            legacyIcon: false,
            lowResolutionIcons: false,
          },
        },
      },
      settings: {
        scalingAlgorithm: 'Mitchell',
        errorOnImageTooSmall: false,
        readmeFile: false,
        htmlCodeFile: false,
        usePathAsIs: false,
      },
      markupFile: FAVICON_DATA_FILE,
    },
    function () {
      done()
    },
  )
})

gulp.task('copy-webmanifest', function () {
  return gulp
    .src(paths.favicons.srcFolder + 'site.webmanifest')
    .pipe(gulp.dest(paths.favicons.dist))
})

gulp.task('inject-favicon', function () {
  return gulp
    .src(paths.views.dist + '*.html')
    .pipe(
      realFavicon.injectFaviconMarkups(
        JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code,
      ),
    )
    .pipe(gulp.dest(paths.views.dist))
})

gulp.task(
  'favicons',
  gulp.series('favicons-img', 'copy-webmanifest', 'inject-favicon'),
)
