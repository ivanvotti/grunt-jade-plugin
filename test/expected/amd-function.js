define(['runtime', 'underscore'], function(jade, _) {
this["Templates"] = this["Templates"] || {};

this["Templates"]["index"] = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<!DOCTYPE html><html><head><title>My title</title><script src="script.js"></script></head><body><div id="content"><h1>' + escape((interp = title) == null ? '' : interp) + '</h1></div></body></html>');
}
return buf.join("");
};

this["Templates"]["user/account"] = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<!DOCTYPE html><html><head><title>My title</title></head><body><div id="content"><h1>' + escape((interp = username) == null ? '' : interp) + ' account</h1></div></body></html>');
}
return buf.join("");
};
return this["Templates"];
});