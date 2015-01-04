(function(){
this["MyApp"] = this["MyApp"] || {};
this["MyApp"]["Templates"] = this["MyApp"]["Templates"] || {};

this["MyApp"]["Templates"]['basic'] = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<p>Basic template</p>");;return buf.join("");
};
}).call(this);