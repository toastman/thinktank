/**
 * Created by andriivandakurov on 10/23/13.
 */
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      options: {
        livereload: true,
        debounceDelay: 250
      },
      html:{
        files: ['app/**/*.html']
      },
      css: {
        files: ['app/**/*.scss'],
        tasks: ['sass:dev', 'autoprefixer:dev', 'cssmin:compression']
      },
      js:{
        files: ['app/**/*.js', '!app/js/main.js', '!app/js/templates/*.js'],
        tasks: ['uglify:dev']
      },
      templates:{
        files: ['app/js/templates/*.hbs'],
        tasks: ['handlebars', 'uglify:dev']
      }
    },

    autoprefixer: {
      dev: {
        src: 'app/css/main.css'
      }
    },

    sass: {                             // Task
      dev: {
        files: {                        // Dictionary of files
          'app/css/main.css': 'app/css/main.scss'   // 'destination': 'source'
        }
      },
      build:{
        files: {                         // Dictionary of files
          'main.css': 'main.scss'       // 'destination': 'source'
        }
      }
    },

    uglify: {
      options: {
        mangle: {
          except:['thinkTank', 'thinkTank.wr', 'Handlebars', 'JST']
        },
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        sourceMap: 'app/js/main-map.js.map'
      },
      dev: {
        src: [
          'app/js/libs/*.js',
          'app/js/modules/*.js',
          'app/js/templates/*.js',
          'app/js/handlebars-partials.js',
          'app/js/extensions.js',
          'app/js/index.js'
        ],
        dest: 'app/js/main.js'
      },
      build: {
        src: 'app/**/*.js',
        dest: 'build/js/main.js'
      }
    },

    htmlmin: {                                     // Task
      compression: {                               // Target
        options: {                                 // Target options
          removeComments: true,
          collapseWhitespace: true
        },
        files: {                                   // Dictionary of files
          'build/index.html': 'app/index.html'     // 'destination': 'source'
        }
      }
    },

    cssmin: {
      compression: {
        files: {
          'app/css/main.css': ['app/css/main.css']
        }
      }
    },

    handlebars: {
      compile: {
        options: {
          processName: function(filePath) {
            return filePath.replace('app/js/templates/', '').replace('.hbs', '');
          },
          namespace: "thinkTank.JST"
        },
        files: {
          "app/js/templates/templates.js": "app/js/templates/*.hbs"
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-handlebars');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'htmlmin']);

};