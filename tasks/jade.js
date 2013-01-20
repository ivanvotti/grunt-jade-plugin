module.exports = function(grunt) {
  'use strict';

  grunt.registerMultiTask('jade', 'Compile Jade templates to JavaScript file.', function() {
    var jade = require('jade');
    var helpers = require('grunt-lib-contrib').init(grunt);

    var defaults = {
      amd: false,
      runtimeName: 'jade',
      compileDebug: false,
      namespace: 'Templates',
      processName: function(filename) { return filename; }
    };
    var options = helpers.options(this, defaults);
    grunt.verbose.writeflags(options, 'Options');

    // TODO: ditch this when grunt v0.4 is released
    this.files = this.files || helpers.normalizeMultiTaskFiles(this.data, this.target);

    var compiled, srcFiles, fileContents, templateName, resultContent;
    var output = [];
    var nsInfo = helpers.getNamespaceDeclaration(options.namespace);
    var compilationOptions = {
      client: true,
      compileDebug: options.compileDebug
    };

    this.files.forEach(function(files) {
      srcFiles = grunt.file.expand(files.src);
      srcFiles.forEach(function(filepath) {
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
        if (options.amd) {
          resultContent = typeof options.amd == "function" ? options.amd(resultContent, nsInfo, options) : "define(['"+options.runtimeName+"'], function(jade) {\n"+resultContent+"\nreturn "+nsInfo.namespace+";\n});";
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
