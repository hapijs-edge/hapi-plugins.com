var glob = require('glob');
var path = require('path');

var load = function (options, callback) {

    options = options || {};
    options.extension = options.extension || '.js';
    var models = {};
    
    var files = glob.sync('*' + options.extension, {cwd: options.path || __dirname});
    for(var i in files) {
        if (files[i] != path.basename(__filename)) {
            var key = path.basename(files[i], options.extension);
            key = key.charAt(0).toUpperCase() + key.slice(1);
            
            models[key] = require((options.path || __dirname) + '/' + files[i]);
            
            /* Use the following instead of above 
                  IF you want to be able to pass options on instantiation */
            // models[key] = new M(options, client);
            // M._loaded = models[key];
        }
    }

    if (callback) {
        return callback(null, models);
    }
    
    return models;
};


exports.register = function (plugin, options, next) {

    load({path: __dirname + '/' + options.path}, function (err, models) {

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