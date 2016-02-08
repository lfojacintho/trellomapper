module.exports = function(grunt) {

  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: 8080,
          livereload: 35729,
        }
      }
    },
    watch: {
      options: {
        livereload: true,
      },
      all: {
        files: ['*.css', '*.js', '*.html'],
      },
    },
    mustache_render: { 
      render: {
        options: {
          // Target specific options go here 
        },
        files : [
          { 
            src: 'main.pre.js',
            data: './keys.json',
            dest: 'main.js'
          }
        ]
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mustache-render');

  grunt.registerTask('default', ['mustache_render', 'connect', 'watch']);

};