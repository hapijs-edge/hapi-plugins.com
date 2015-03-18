var glob = require('glob');
var path = require('path');

var load = function (options, callback) {

    options = options || {};
    options.extension = options.extension || '.js';
    var models = {};

    var files = glob.sync('**/*' + options.extension, {cwd: options.path || __dirname});
    for(var i in files) {
        if (files[i] != path.basename(__filename)) {
            var key = path.basename(files[i], options.extension);
            key = key.charAt(0).toUpperCase() + key.slice(1);
            var paths = files[i].split("/");
            var isNested = paths.length > 1;

            var module_path = (options.path || __dirname) + '/' + files[i];
            var ModelClass = require(module_path);
            var leaf = models;
            while(paths.length > 1) {
                var subkey = paths.shift();
                if (!leaf[subkey]) {
                    leaf[subkey] = {};
                }
                leaf = leaf[subkey];
            }
            leaf[key] = new ModelClass(options, options.client || null);
            // ModelClass._loaded = models[key];
        }
    }

    if (callback) {
        return callback(null, models);
    }

    return models;
};


exports.register = function (plugin, options, next) {

    var settings = {path: __dirname};
    if (options.client) {
        settings.client = options.client;
    }
    load(settings, function (err, models) {

        if (err) {
            throw err;
        }
        plugin.expose('models', models);

        next();
    });
};

exports.register.attributes = {
    name: 'models',
    version: require('../../package.json').version
};
