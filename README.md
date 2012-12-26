# grunt-jade-plugin [!['Build status'][travis_image_url]][travis_page_url]

[travis_image_url]: https://secure.travis-ci.org/ivanvotti/grunt-jade-plugin.png?branch=master
[travis_page_url]: https://travis-ci.org/ivanvotti/grunt-jade-plugin

Compile Jade templates to one JavaScript file (normal or AMD).

## Installation

In your project's [gruntfile][getting_started] directory, run:

```bash
npm install grunt-jade-plugin
```

Then add this line to your project's [gruntfile][getting_started]:

```javascript
grunt.loadNpmTasks('grunt-jade-plugin');
```

## Config Examples

### AMD compilation

``` javascript
jade: {
  compile: {
    options: {
      amd: true,

      amdDependences: {
        'jade': 'jade',
        'underscore': '_'
      },
    },

    files: {
      'templates.js': 'temlates/*.jade'
    }
  }
}
```

The result templates.js file will content:
``` javascript
define(["jade", "underscore"], function(jade, _) {
  // Compiled templates will be here.
}
```

You can use your compiled templates like this:
``` javascript
define(["templates"], function(templates) {
  var data = {name: 'John', age: 28};
  var htmlResult = templates['templates/user.jade'](data);
}
```

### Normal JS file compilation

``` javascript
jade: {
  compile: {
    options: {
      namespace: 'MyApp.Templates'
    },
    files: {
      'templates.js': 'temlates/*.jade'
    }
  }
}
```

The result templates.js file will content:
``` javascript
this['MyApp'] = this['MyApp'] || {};
this['MyApp']['Templates'] = this['MyApp']['Templates'] || {};

// Template function
this['MyApp']['Templates']['templates/user.jade'] = function() {};
```

You can use your compiled templates like this:
``` javascript
var data = {name: 'John', age: 28};
var htmlResult = MyApp.Templates['templates/user.jade'](data);
```

## Documentation

Inside your `grunt.js` file, add a section named `jade`. This section specifies the files to compile and the options used with [Jade][].

#### Files ```object```

This defines what files this task will process and should contain key:value pairs.

The key (destination) should be an unique filepath (supports [grunt.template][]) and the value (source) should be a filepath or an array of filepaths (supports [minimatch][]).

Note: Values are precompiled to the namespaced array in the order passed.

Examples:
```javascript
files: {
  'result.js': 'source/*.jade', // includes files from source dir only
  'result.js': 'source/**/*.jade', // includes files from source dir and all its subdirs
  'result.js': ['path/to/sources/file.jade', 'path/to/more/other.jade']
}
```

#### Options ```object```

This controls how this task operates and should contain key:value pairs, see options below.

Defaults:

```javascript
options: {
  amd: false,
  amdDependences: null,
  compileDebug: false,
  namespace: 'Templates',
  processName: function(filename) { return filename; }
}
```

##### amd ```boolean```

Determine if preprocessed template functions will be wrapped in [Require.js][] define function (default is `false`).

``` javascript
define(['jade'], function(jade) {
  // ...
});
```

##### amdDependences ```object```

``` javascript
amdDependences: {
  'jade': 'jade',
  'underscore': '_'
},
```

Result:
``` javascript
define(["jade", "underscore"], function(jade, _) {
  // Compiled templates will be here.
}
```

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
this['MyApp'] = this['MyApp'] || {};
this['MyApp']['Templates'] = this['MyApp']['Templates'] || {};

// Template function
this['MyApp']['Templates']['templates/user.jade'] = function() {};
```

##### processName ```function```

This option accepts a function which takes one argument (the template filepath) and returns a string which will be used as the key for the precompiled template object.  The example below stores all templates on the default Templates namespace in capital letters.

``` javascript
options: {

  // Improving access to templates.
  // Before: Templates['app/templates/layout.jade']
  // After: Templates['layout'] or Templates.layout

  processName: function(filename) {
    return filename.split('/').pop().split('.')[0]
  }
}
```

## Release History
Check the [HISTORY.md][] file for change logs and release notes.

## License
Copyright (c) 2012 Ivan Votti
Licensed under the MIT license.
<https://github.com/ivanvotti/grunt-jade-plugin/blob/master/LICENSE-MIT>

[history.md]: https://github.com/ivanvotti/grunt-jade-plugin/blob/master/HISTORY.md
[grunt]: https://github.com/gruntjs/grunt
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md
[grunt.template]: https://github.com/gruntjs/grunt/blob/master/docs/api_template.md
[minimatch]: https://github.com/isaacs/minimatch
[require.js]: http://requirejs.org
[jade]: http://jade-lang.com
