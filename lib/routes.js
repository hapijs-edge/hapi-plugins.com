var Handlebars = require('handlebars');

exports.register = function (plugin, options, next) {

    plugin.dependency('controllers');
    plugin.dependency('models');

    var Controllers = plugin.plugins.controllers.handlers;
    var Models = plugin.plugins.models.models;
    plugin.bind({
        models: Models
    });

    plugin.route([
        // Application Routes
        { method: 'GET',  path: '/plugins/upload', config: Controllers.Plugin.getUpload },
        { method: 'POST', path: '/plugins/upload', config: Controllers.Plugin.postUpload },
        { method: 'GET',  path: '/plugins/{id}/download', config: Controllers.Plugin.download },
        { method: 'GET',  path: '/plugins/{id}/edit', config: Controllers.Plugin.edit },
        { method: 'GET',  path: '/plugins/{id}/like', config: Controllers.Plugin.like },
        { method: 'GET',  path: '/plugins/{id}', config: Controllers.Plugin.get },


        // Assets & Static Routes
        { method: 'GET',  path: '/css/{path*}', handler: Controllers.Static.css },
        { method: 'GET',  path: '/js/{path*}', handler: Controllers.Static.js },
        { method: 'GET',  path: '/heartbeat', config: Controllers.Static.heartbeat }
    ]);

    var handlebars = Handlebars.create();
    plugin.views({
        engines: {
            html: {
                module: handlebars
            }
        },
        path: __dirname + './views'
    });

    next();
};



exports.register.attributes = {
    name: 'routes',
    version: require('../package.json').version
};
