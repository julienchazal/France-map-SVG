module.exports = function(grunt) {
  grunt.initConfig({
    // configurable paths
    yeoman: {
        app: 'app',
        dist: '../dev'
    },
    less: {
      compile: {
        files: {
          // target.css file: source.less file
          "<%= yeoman.app %>/css/app.css": ["<%= yeoman.app %>/css/less/vendor/bootstrap/bootstrap.less"]
        },
        options: {
          compress: true,
          yuicompress: false,
          optimization: 2,
          sourceMap: true,
          sourceMapFilename: '<%= yeoman.app %>/css/app.css.map',
          sourceMapRootpath: '/GITHUB/CARTE-DE-FRANCE-SVG/'
        }
      }
    },
    watch: {
      styles: {
        // Which files to watch (all .less files recursively in the less directory)
        files: ['<%= yeoman.app %>/css/less/**/*.less'],
        tasks: ['less'],
        options: {
          nospawn: true
        }
      }
    }
  });
 
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
 
  grunt.registerTask('default', ['less', 'watch']);
};