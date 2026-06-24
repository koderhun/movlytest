'use strict'

import gulp from 'gulp'

const requireDir = require('require-dir')

const paths = {
  views: {
    src: ['./src/views/**/*.html', './src/views/pages/*.html'],
    dist: './dist/',
    watch: ['./src/blocks/**/*.html', './src/views/**/*.html'],
  },
  styles: {
    src: './src/styles/app.{scss,sass}',
    dist: './dist/styles/',
    watch: ['./src/blocks/**/*.{scss,sass}', './src/styles/**/*.{scss,sass}'],
  },
  scripts: {
    src: './src/scripts/index.js',
    vendor: './src/scripts/vendor.js',
    dist: './dist/scripts/',
    watch: ['./src/blocks/**/*.js', './src/scripts/**/*.js'],
  },
  images: {
    src: [
      './src/images/**/*.{jpg,jpeg,png,gif,tiff,svg}',
      '!./src/images/favicon/*.{jpg,jpeg,png,gif,tiff}',
    ],
    dist: './dist/images/',
    watch: './src/images/**/*.{jpg,jpeg,png,gif,svg,tiff}',
  },
  fonts: {
    src: './src/fonts/**/*.{woff,woff2,ttf,otf,eot}',
    dist: './dist/fonts/',
    watch: './src/fonts/**/*.{woff,woff2,ttf,otf,eot}',
  },
  favicons: {
    srcFolder: './src/images/favicon/',
    src: './src/images/favicon/favicon.png',
    dist: './dist/images/favicons/',
    forHtmlPath: './images/favicons/',
    data: './dist/images/favicons/data.json',
  },
  gzip: {
    src: './src/.htaccess',
    dist: './dist/',
  },
  deploy: {
    src: './dist/**/*',
  },
}

requireDir('./gulp-tasks/')

export {paths}

export const development = gulp.series(
  'clean',
  'views',
  gulp.parallel([
    'styles',
    'scripts',
    'vendor',
    'images',
    'webp',
    'fonts',
    'favicons',
  ]),
  gulp.parallel('serve'),
)

export const prod = gulp.series(
  'clean',
  'views',
  gulp.parallel([
    'styles',
    'scripts',
    'vendor',
    'images',
    'webp',
    'fonts',
    'favicons',
    'gzip',
  ]),
)

export default development
