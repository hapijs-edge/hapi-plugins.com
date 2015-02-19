
var Mongoose = require('mongoose');

Mongoose.connect('mongodb://localhost/hapi_plugins');

var internals = {};


module.exports.plugin = new Mongoose.Schema({
});

module.exports.user = new Mongoose.Schema({
});
