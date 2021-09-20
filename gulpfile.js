const {src, dest, watch, series, parallel} = require("gulp");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const cssnano = require("gulp-cssnano");
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync").create();
const sourcemaps = require("gulp-sourcemaps");
const sass = require('gulp-sass')(require('sass'));

//Sökvägar
const files = {
    htmlPath: "src/**/*.html",
    //cssPath: "src/**/*.css",
    jsPath: "src/**/*.js",
    picPath: "src/pics/*",
    sassPath: "src/**/*.scss"
}

//HTML-task - kopierar filer
function copyHTML() {
    return src(files.htmlPath)
    .pipe(dest('pub'))
}

//JS-task - Konkatinering, Minifiering
function jsTask() {
    return src(files.jsPath)
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write("../maps"))
    .pipe(dest('pub/js'));
}

/*
//CSS-task - Konkatinering, Minifiering
function cssTask () {
    return src(files.cssPath)
    .pipe(sourcemaps.init())
    .pipe(concat('main.css'))
    .pipe(cssnano())
    .pipe(sourcemaps.write("../maps"))
    .pipe(dest('pub/css'))
    .pipe(browserSync.stream());
}*/

//Sass-task
function sassTask() {
    return src(files.sassPath)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on("error", sass.logError))
        .pipe(sourcemaps.write("../maps"))
        .pipe(dest("pub/css"))
        .pipe(browserSync.stream());
}


//Picture-task - Komprimera
function picTask() {
    return src(files.picPath)
    .pipe(imagemin())
    .pipe(dest('pub/pics'));
}


//Watch
function watchTask() {

    browserSync.init({
        server: "./pub"
    });
    

    watch([files.htmlPath, files.jsPath, /*files.cssPath,*/ files.picPath, files.sassPath], parallel (copyHTML, jsTask, /*cssTask,*/ picTask, sassTask)).on("change", browserSync.reload);
}

exports.default = series (
    parallel (copyHTML, jsTask, /*cssTask,*/ picTask, sassTask), 
    watchTask);