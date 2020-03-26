var gulp = require('gulp');
var rename = require('gulp-rename');
var babel = require("gulp-babel");


gulp.task('build-MarkdownConvertor',function(done) {
	return gulp.src('js/src/MarkdownConvertor/MarkdownConvertor.js')
	    .pipe(babel())
	    .pipe(gulp.dest('js/src/MarkdownConvertor/dist'));
});

gulp.task('build',gulp.parallel('build-MarkdownConvertor'));

gulp.task('copy-js', gulp.series('build',function(done) {
	gulp.src('node_modules/codemirror/lib/**.js')
	    .pipe(gulp.dest('Assets/js/codemirror/'));
	gulp.src('node_modules/eve/**.js')
	    .pipe(gulp.dest('Assets/js/eve/'));
	gulp.src('node_modules/highlightjs/**.js')
	    .pipe(gulp.dest('Assets/js/highlightjs/'));
	gulp.src('node_modules/jquery/dist/**.js')
	    .pipe(gulp.dest('Assets/js/jquery/'));
	gulp.src('node_modules/katex/dist/**.js')
	    .pipe(gulp.dest('Assets/js/katex/'));
	gulp.src('node_modules/markdown-it/dist/**.js')
	    .pipe(gulp.dest('Assets/js/markdown-it/'));
	gulp.src('node_modules/raphael/**.js')
	    .pipe(gulp.dest('Assets/js/raphael/'));
	gulp.src('node_modules/squire-rte/source/**.js')
	    .pipe(gulp.dest('Assets/js/squire-rte/'));
	gulp.src('node_modules/to-mark/dist/**.js')
	    .pipe(gulp.dest('Assets/js/to-mark/'));
	gulp.src('js/src/MarkdownConvertor/dist/**.js')
	    .pipe(gulp.dest('js/'));
	done();
}));

gulp.task('Copy-MathJax',gulp.series('build',function(done) {
	gulp.src('node_modules/MathJax/unpacked/**')
	    .pipe(gulp.dest('Assets/MathJax/'));
	done();
}));

gulp.task('copy-css', gulp.series('build',function(done) {
	gulp.src('node_modules/codemirror/lib/**.css')
	    .pipe(gulp.dest('Assets/css/codemirror/'));
	gulp.src('node_modules/eve/**.css')
	    .pipe(gulp.dest('Assets/css/eve/'));
	gulp.src('node_modules/highlightjs/**.css')
	    .pipe(gulp.dest('Assets/css/highlightjs/'));
	gulp.src('node_modules/jquery/dist/**.css')
	    .pipe(gulp.dest('Assets/css/jquery/'));
	gulp.src('node_modules/katex/dist/**.css')
	    .pipe(gulp.dest('Assets/css/katex/'));
	gulp.src('node_modules/markdown-it/dist/**.css')
	    .pipe(gulp.dest('Assets/css/markdown-it/'));
	gulp.src('node_modules/raphael/**.css')
	    .pipe(gulp.dest('Assets/css/raphael/'));
	gulp.src('node_modules/squire-rte/source/**.css')
	    .pipe(gulp.dest('Assets/css/squire-rte/'));
	gulp.src('node_modules/to-mark/dist/**.css')
	    .pipe(gulp.dest('Assets/css/to-mark/'));
	done();
}));

gulp.task('default', gulp.parallel('copy-js','copy-css','Copy-MathJax'));
