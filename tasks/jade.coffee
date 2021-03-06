module.exports = (grunt) ->
  'use strict'

  jade = require('jade')
  JADE_RUNTIME_PATH = require.resolve('jade/lib/runtime')

  grunt.registerMultiTask 'jade2js', 'Compile Jade templates to one JavaScript file (normal or AMD).', ->
    options = @options
      amd: false
      amdDependences: {}
      includeRuntime: true
      injectBefore: ''
      compileDebug: false
      namespace: 'Templates'
      processName: (filename) -> filename.split('/').pop().split('.')[0]
      filters: []

    for filterName, filter of options.filters
      jade.filters[filterName] = filter

    grunt.verbose.writeflags options, 'Options'

    output = []
    nsInfo = getNamespaceDeclaration(options.namespace, options.amd)
    compilationOptions =
      compileDebug: options.compileDebug

    # Prepare Jade runtime.
    runtimeContent = grunt.file.read(JADE_RUNTIME_PATH).replace(/exports/g, 'jade')
    runtimeContent = 'var jade = {};\n' + runtimeContent

    for files in @files
      for filepath in files.src
        fileContents = grunt.file.read(filepath)

        try
          compilationOptions.filename = filepath
          compiled = jade.compileClient(fileContents, compilationOptions)
        catch errorMessage
          grunt.log.error errorMessage
          grunt.fail.warn "Jade failed to compile #{filepath}."

        templateName = options.processName(filepath)
        output.push "#{nsInfo.namespace}['#{templateName}'] = #{compiled};"

      if output.length == 0
        grunt.log.writeln 'Nothing to compile.'
        return

      output.unshift nsInfo.declaration

      if options.includeRuntime
        output.unshift runtimeContent

      if options.injectBefore
        output.unshift options.injectBefore

      resultContent = output.join('\n\n')

      if not options.amd
        resultContent = "(function(){\n#{resultContent}\n}).call(this);"

      if options.amd
        modulePaths = ("'#{modulePath}'" for modulePath of options.amdDependences).join(', ')
        moduleNames = (moduleName for p, moduleName of options.amdDependences).join(', ')

        resultContent = """define([#{modulePaths}], function(#{moduleNames}) {
          #{resultContent}
          return #{nsInfo.namespace};
        });"""

      grunt.file.write files.dest, resultContent
      grunt.log.writeln "File '#{files.dest.cyan}' created."

  getNamespaceDeclaration = (ns, isLocal) ->
    output = []
    curPath = (if isLocal then 'exports' else 'this')
    nsParts = ns.split('.')

    for curPart in nsParts
      curPath += "[#{JSON.stringify(curPart)}]"
      output.push "#{curPath} = #{curPath} || {};"

    if isLocal
      output.unshift 'var exports = exports || {};'

    namespace: curPath
    declaration: output.join('\n')
