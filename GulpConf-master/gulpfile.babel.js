//  =========================================================
//  gulpfile.js
//  =========================================================

//  -------------------------------------------- strict mode

"use strict";

//  ----------------------------------------------- requires

const gulp = require("gulp");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify-es").default;
const babel = require("gulp-babel");
const htmlmin = require("gulp-htmlmin");
const replace = require("gulp-string-replace");
const browserSync = require("browser-sync").create();

// var typescript = require('gulp-typescript');

sass.compiler = require("node-sass");

// ------------------------------------------------ configs
const config = {
  browser: {
    opts: {
      server: "./dist"
    }
  },
  html: {
    src: "src/*.html",
    dest: "dist",
    opts: {
      collapseWhitespace: true,
      removeComments: true
    }
  },
  sass: {
    src: "./src/resources/scss/**/*.{scss,sass}",
    dest: "./dist/resources/css",
    opts: {
      mynify: {
        outputStyle: "compressed"
      }
    }
  },
  typescript: {
    src: "./src/resources/ts/**/*.ts",
    dest: "./dist/resources/js",
    opts: {}
  },
  javascript: {
    src: "./src/resources/js/**/*.js",
    dest: "./dist/resources/js",
    opts: {}
  }
};

// ---------------------------------------------- Gulp Tasks

gulp.task("serve", function() {
  browserSync.init(config.browser.opts);
});

gulp.task("html", () => {
  return gulp
    .src(config.html.src)
    .pipe(replace("scss", "css"))
    .pipe(htmlmin(config.html.opts))
    .pipe(gulp.dest(config.html.dest));
});

gulp.task("sass", function() {
  return gulp
    .src(config.sass.src)
    .pipe(sass.sync(config.sass.opts.mynify).on("error", sass.logError))
    .pipe(gulp.dest(config.sass.dest))
    .pipe(browserSync.stream());
});

gulp.task("javascript", function() {
  return gulp
    .src(config.javascript.src)
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(config.javascript.dest));
});

// ---------------------------------------------- Gulp Watch
gulp.task("watch:styles", function() {
  gulp.watch(config.sass.src, gulp.series("sass"));
  browserSync.stream();
});

gulp.task("watch:scripts", function() {
  gulp
    .watch(config.javascript.src, gulp.series("javascript"))
    .on("change", browserSync.reload);
});

gulp.task("watch:index", function() {
  gulp
    .watch(config.html.src, gulp.series("html"))
    .on("change", browserSync.reload);
});

gulp.task(
  "watch",
  gulp.parallel("watch:index", "watch:styles", "watch:scripts")
);

gulp.task("start", gulp.parallel("html", "sass", "javascript"));

// -------------------------------------------- Default task
gulp.task("default", gulp.series("start", gulp.parallel("watch", "serve")));
