var Handlebars = require('handlebars');

exports.register = function (plugin, options, next) {

    var Controllers = plugin.plugins.controllers.handlers;
    Controllers.plugin = require('./controllers/plugin');
    var p = require('purdy');
    p(Controllers.plugin);
    plugin.route([
        // Application Routes
        { method: 'GET',  path: '/plugin/upload', handler: Controllers.plugin.getUpload },
        { method: 'POST',  path: '/plugin/upload', config: Controllers.plugin.postUpload },
        { method: 'GET',  path: '/plugin/download', handler: Controllers.plugin.download },
        { method: 'GET',  path: '/plugin/edit', handler: Controllers.plugin.edit },
        { method: 'GET',  path: '/plugin/like', handler: Controllers.plugin.like },
        { method: 'GET',  path: '/plugin', handler: Controllers.plugin.get },



        // Assets & Static Routes
        { method: 'GET',  path: '/css/{path*}', handler: Controllers.Static.css },
        { method: 'GET',  path: '/js/{path*}', handler: Controllers.Static.js },
        { method: 'GET',  path: '/heartbeat', config: Controllers.Static.heartbeat },
    ]);


    var Models = plugin.plugins.models.models;
    plugin.bind({
        models: Models
    });

    var handlebars = Handlebars.create();
    plugin.views({
        engines: {
            html: {
                module: handlebars
            }
        },
        path: __dirname + '/../views'
    });

    next();
};



exports.register.attributes = {
    name: 'routes',
    version: require('../package.json').version
};
