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

    // Before generating any new files, remove any previously-created files.
    clean: {
      test: ['tmp']
    },

    jade: {
      basic: {
        files: {
          'tmp/basic.js': ['test/fixtures/basic/file1.jade', 'test/fixtures/basic/file2.jade']
        },

        options: {
          namespace: 'MyApp.Templates'
        }
      },

      amd: {
        files: {
          'tmp/amd.js': ['test/fixtures/full/index.jade', 'test/fixtures/full/user/account.jade']
        },

        options: {
          amd: true,
          runtimeName: 'runtime',
          processName: function(filename) { return filename.replace('test/fixtures/full/', '').replace('.jade', ''); }
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tasks: ['test/*_test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // The clean plugin helps in testing.
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.renameTask('test', 'nodeunit');
  grunt.registerTask('test', 'clean jade nodeunit');

  // By default, lint and run all tests.
  grunt.registerTask('default', 'lint test');
};
