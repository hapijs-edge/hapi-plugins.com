// Load libraries

var Async = require('async');
var Hoek = require('hoek');
var Mongoose = require('mongoose');


Mongoose.connect('mongodb://localhost/hapi_plugins');
// Mongoose.connect('mongodb://hapi:powdered-toast-man@dogen.mongohq.com:10018/hapi-plugins-dev');

var internals = {};


internals.plugin = new Mongoose.Schema({
    'name': { type: String, required: true },
    'description': { type: String, required: false },
    'version': { type: String, required: true },
    'authors': { type: Array, required: false },
    'license': { type: String, required: false },
    'repository': { type: String },
    'homepage': { type: String },
    'updated_at': { type: Date, default: Date.now },
    'created_at': { type: Date, default: Date.now },
    'keywords': { type: Array },
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


internals.plugin.statics.get = function(username, callback) {

    return this.find({ username: username }, function (err, result) {

        if (err) {
            return callback(err);
        }

        return callback(null, result[0]);
    });
};

internals.plugin.statics.createOrUpdate = function(pluginJS, callback) {

    var self = this;
    var pluginObj = internals.pluginJStoObj(pluginJS);
    self.update({ name: pluginObj.name }, pluginObj, function (err, numberAffected, raw) {

        if (numberAffected === 0) {
            var plugin = new self(pluginObj)
            return plugin.save(function (err, result) {
                if (err) {
                }
                return callback(err, result);
            });
        }

        return callback(err);
    });
};

internals.pluginJStoObj = function (pluginJS) {
    var schema = {
        name: pluginJS.name,
        description: pluginJS.description || '',
        version: pluginJS.version || '',
        authors: pluginJS.author,
        license: pluginJS.license || '',
        repository: pluginJS.repository || '',
        homepage: pluginJS.homepage || '',
        keywords: pluginJS.keywords || [],
        // dependencies: pluginJS.dependencies
    };
    return schema;
};

internals.plugin.statics.batchCreate = function(pluginsJS, callback) {

    var self = this;

    var addPlugin = function (pluginJS) {
        return function (next) {

            self.createOrUpdate(pluginJS, next);
        }
    }

    var batch = [];

    for (var i = 0, il = pluginsJS.length; i < il; ++i) {
        var pluginJS = pluginsJS[i];
        var unpublished = Hoek.reach(pluginJS, 'time.unpublished');
        if (!unpublished) {
            batch.push(addPlugin(pluginJS));
        }
    }

    Async.parallel(batch, callback);
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

internals.user.statics.getOrCreate = function (username, callback) {

    var self = this;

    this.get(username, function (err, user) {

        if (!user) {
            var user = new self({ username: username});
            user.save(function (err) {

                if (err) {
                    return callback(err);
                }
                return callback(null, user);
            })
        }
        else {
            return callback(null, user);
        }
    });
};






module.exports = {
    plugin: Mongoose.model('plugin', internals.plugin),
    user: Mongoose.model('user', internals.user),
    mongoose: Mongoose
};
