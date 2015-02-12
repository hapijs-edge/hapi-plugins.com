var Handlebars = require('handlebars');

exports.register = function (plugin, options, next) {

    var Controllers = plugin.plugins.controllers.handlers;
    plugin.route([
        // Application Routes
        
        
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