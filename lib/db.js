
var Mongoose = require('mongoose');

Mongoose.connect('mongodb://localhost/hapi_plugins');

var internals = {};


internals.plugin = new Mongoose.Schema({
    'name': { type: String, required: true },
    'description': { type: String, required: true },
    'version': { type: String, required: true },
    'authors': { type: Array, required: true },
    'license': { type: String, required: true },
    'repo': { type: String },
    'npm': { type: String },
    'updated_at': { type: Date, default: Date.now },
    'created_at': { type: Date, default: Date.now },
    'keywords': { type: String },
    'dependencies': { type: Array },
    'dependents': { type: Array },
    'stats': {
        'releases': { type: String },
        'downloads': { type: String },
        'downloads_this_month': { type: String },
        'open_issues': { type: String },
        'pull_requests': { type: String }
    }
});


internals.plugin.statics.get = function(name, callback) {

    return this.find({ name: name }, function (err, result) {

        if (err) {
            return callback(err);
        }

        return callback(null, result[0]);
    });
};



internals.user = new Mongoose.Schema({
    'username': { type: String, required: false },
    'name': { type: String, required: false },
    'email': { type: String, required: false },
    'updated_at': { type: Date, default: Date.now },
    'created_at': { type: Date, default: Date.now },
    'likes': [internals.plugin]
});


internals.user.statics.get = internals.plugin.statics.get;

internals.user.methods.like = function (plugin, callback) {

    this.likes.push(plugin)
    this.save(callback);
};



module.exports = {
    plugin: Mongoose.model('plugin', internals.plugin),
    user: Mongoose.model('user', internals.user),
    mongoose: Mongoose
};
