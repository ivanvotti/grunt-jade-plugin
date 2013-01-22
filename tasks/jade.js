/*global require:true*/

module.exports = function(grunt) {
  'use strict';

  grunt.registerMultiTask('jade',
    'Compile Jade templates to one JavaScript file (normal or AMD).', function() {

    var getNamespaceDeclaration = function(ns, isLocal) {
      var output = [];
      var curPath = isLocal ? 'exports' : 'this';
      var nsParts = ns.split('.');

      nsParts.forEach(function(curPart, index) {
        curPath += '[' + JSON.stringify(curPart) + ']';
        output.push(curPath + ' = ' + curPath + ' || {};');
      });

      if (isLocal) {
        output.unshift('var exports = exports || {};');
      }

      return {
        namespace: curPath,
        declaration: output.join('\n')
      };
    };

    var path = require('path'),
        jade = require('jade'),
        jadeRuntimePath = require.resolve('jade/lib/runtime'),
        helpers = require('grunt-lib-contrib').init(grunt),
        _ = grunt.utils._;

    var defaults = {
      amd: false,
      amdDependences: null,
      includeRuntime: true,
      compileDebug: false,
      namespace: 'Templates',
      processName: function(filename) { return filename.split('/').pop().split('.')[0]; }
    };
    var options = helpers.options(this, defaults);
    grunt.verbose.writeflags(options, 'Options');

    // TODO: ditch this when grunt v0.4 is released
    this.files = this.files || helpers.normalizeMultiTaskFiles(this.data, this.target);

    var compiled, srcFiles, fileContents, templateName, resultContent;
    var output = [];
    var nsInfo = getNamespaceDeclaration(options.namespace, options.amd);
    var compilationOptions = {
      client: true,
      compileDebug: options.compileDebug
    };

    this.files.forEach(function(files) {
      srcFiles = grunt.file.expand(files.src);
      srcFiles.forEach(function(filepath) {

        // Ignore if file name starts with underscore: _file.jade
        if (path.basename(filepath).indexOf('_') === 0) {
          return;
        }

        fileContents = grunt.file.read(filepath);

        try {
          compilationOptions.filename = filepath;
          compiled = jade.compile(fileContents, compilationOptions);
        } catch (e) {
          grunt.log.error(e);
          grunt.fail.warn('Jade failed to compile '+filepath+'.');
        }

        templateName = options.processName(filepath);
        output.push(nsInfo.namespace+'["'+templateName+'"] = '+compiled+';');
      });

      if (output.length > 0) {
        output.unshift(nsInfo.declaration);

        resultContent = output.join('\n\n');

        if (options.includeRuntime) {
          var runtimeContent = grunt.file.read(jadeRuntimePath);
          runtimeContent = 'var jade = {};\n' + runtimeContent.replace(/exports/g, 'jade');
          resultContent = runtimeContent + '\n' + resultContent;
        }

        if (options.amd) {
          var modulePaths = [],
              moduleNames = [];

          if (options.amdDependences) {
            _.each(options.amdDependences, function (moduleName, modulePath) {
              modulePaths.push('"'+modulePath+'"');
              moduleNames.push(moduleName);
            });
          }

          modulePaths = modulePaths.join(', ');
          moduleNames = moduleNames.join(', ');

          resultContent = 'define(['+modulePaths+'], function('+moduleNames+') {\n'+resultContent+'\nreturn '+nsInfo.namespace+';\n});';
        }

        grunt.file.write(files.dest, resultContent);
        grunt.log.writeln('File "' + files.dest.cyan + '" created.');
        output.length = 0;
      } else {
        grunt.log.writeln('Nothing to compile.');
      }
    });
  });
};
