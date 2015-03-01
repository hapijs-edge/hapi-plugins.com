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
        { method: 'GET',  path: '/', config: Controllers.Home.get },
        
        { method: 'GET',  path: '/plugins/upload', config: Controllers.Plugin.getUpload },
        { method: 'POST', path: '/plugins/upload', config: Controllers.Plugin.postUpload },
        { method: 'GET',  path: '/plugins/{name}/download', config: Controllers.Plugin.download },
        { method: 'GET',  path: '/plugins/{name}/edit', config: Controllers.Plugin.edit },
        { method: 'GET',  path: '/plugins/{name}/like', config: Controllers.Plugin.like },
        { method: 'GET',  path: '/plugins/{name}', config: Controllers.Plugin.get },
        { method: 'GET',  path: '/plugins', config: Controllers.Plugin.search },

        { method: 'GET',  path: '/admin/plugins/populate', config: Controllers.Plugin.populate },


        // Assets & Static Routes
        { method: 'GET',  path: '/css/{path*}', handler: Controllers.Static.css },
        { method: 'GET',  path: '/img/{path*}', handler: Controllers.Static.img },
        { method: 'GET',  path: '/js/{path*}', handler: Controllers.Static.js },
        { method: 'GET',  path: '/heartbeat', config: Controllers.Static.heartbeat }
    ]);

    var handlebars = Handlebars.create();
    plugin.views({
        engines: {
            html: {
                module: handlebars
            },
            // jsx: require('hapi-react')({
            //     beautify:true,
            //     doctype: ''
            // })
        },
        path: __dirname + '/views'
    });

    next();
};



exports.register.attributes = {
    name: 'routes',
    version: require('../package.json').version
};
