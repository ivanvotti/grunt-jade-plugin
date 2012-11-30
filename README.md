# grunt-jade-plugin [![Build Status](https://secure.travis-ci.org/ivanvotti/grunt-jade-plugin.png?branch=master)](http://travis-ci.org/ivanvotti/grunt-jade-plugin)

> Precompile Jade templates to JavaScript file (normal or AMD).

## Getting Started

Install this grunt plugin next to your project's [grunt.js gruntfile][] with: `npm install grunt-jade-plugin`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-jade-plugin');
```

### Config Examples

Normal JS file compilation.
``` javascript
jade: {
  normal: {
    options: {
      namespace: 'MyApp.Templates'
    },
    files: {
      'path/to/result.js': 'temlates/**/*.jade',
      'path/to/result2.js': ['temlates/main.jade', 'templates/other/*.jade']
    }
  }
}
```

For AMD compilation add `amd: true` option.
``` javascript
jade: {
  amd: {
    options: {
      amd: true,
      processName: function(filename){
        return filename.replace('temlates/', '').replace('.jade', '');
      }
    },
    files: {
      'templates.js': 'temlates/**/*.jade'
    }
  }
}
```

### Defaults

```javascript
options: {
  amd: false,
  runtimeName: 'jade',
  compileDebug: false,
  namespace: 'Templates',
  processName: function(filename) { return filename; }
}
```

## Documentation

Inside your `grunt.js` file, add a section named `jade`. This section specifies the files to compile and the options used with [Jade][].

##### files ```object```

This defines what files this task will process and should contain key:value pairs.

The key (destination) should be an unique filepath (supports [grunt.template][]) and the value (source) should be a filepath or an array of filepaths (supports [minimatch][]).

Note: Values are precompiled to the namespaced array in the order passed.

##### options ```object```

This controls how this task operates and should contain key:value pairs, see options below.

#### Options

##### namespace ```string```

The namespace in which the precompiled templates will be assigned (default is `'Templates'`).  *Use dot notation (e.g. App.Templates) for nested namespaces.*

Example:
``` javascript
options: {
  namespace: 'MyApp.Templates'
}
```

Result:
``` javascript
this["MyApp"] = this["MyApp"] || {};
this["MyApp"]["Templates"] = this["MyApp"]["Templates"] || {};

// Template function
this["MyApp"]["Templates"]["templates/file1.jade"] = function() {...};
```

##### amd ```boolean```

Determine if preprocessed template functions will be wrapped in [Require.js][] define function (default is `false`).

Example:
``` javascript
define(['jade'], function(jade) {
  // ...
});
```

##### processName ```function```

This option accepts a function which takes one argument (the template filepath) and returns a string which will be used as the key for the precompiled template object.  The example below stores all templates on the default Templates namespace in capital letters.

``` javascript
options: {
  processName: function(filename) {
    return filename.toUpperCase();
  }
}
```

Licensed under the MIT license.
<https://github.com/ivanvotti/grunt-jade-plugin/blob/master/LICENSE-MIT>

[grunt]: https://github.com/gruntjs/grunt
[grunt.js gruntfile]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md
[grunt.template]: https://github.com/gruntjs/grunt/blob/master/docs/api_template.md
[minimatch]: https://github.com/isaacs/minimatch
[Require.js]: http://requirejs.org
[jade]: http://jade-lang.com
