module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    lint: {
      all: ['grunt.js', 'tasks/*.js', '<config:nodeunit.tasks>']
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true
      }
    },

    clean: {
      test: ['tmp']
    },

    jade: {
      normalTest: {
        files: {
          'tmp/basic.js': 'test/fixtures/basic.jade'
        },

        options: {
          namespace: 'MyApp.Templates',
          includeRuntime: false
        }
      },

      amdTest: {
        files: {
          'tmp/amd.js': 'test/fixtures/basic.jade'
        },

        options: {
          amd: true,
          amdDependences: {
            'underscore': '_',
            'helpers/helper': 'helper'
          }
        }
      }
    },

    nodeunit: {
      tasks: ['test/*_test.js']
    }
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.renameTask('test', 'nodeunit');

  grunt.registerTask('test', 'clean jade nodeunit');
  grunt.registerTask('default', 'lint test');
};
