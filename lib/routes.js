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
        { method: 'GET',  path: '/plugin/upload', config: Controllers.plugin.getUpload },
        { method: 'POST', path: '/plugin/upload', config: Controllers.plugin.postUpload },
        { method: 'GET',  path: '/plugin/download', config: Controllers.plugin.download },
        { method: 'GET',  path: '/plugin/edit', config: Controllers.plugin.edit },
        { method: 'GET',  path: '/plugin/like', config: Controllers.plugin.like },
        { method: 'GET',  path: '/plugin', config: Controllers.plugin.get },


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
        path: __dirname + '/../views'
    });

    next();
};



exports.register.attributes = {
    name: 'routes',
    version: require('../package.json').version
};
