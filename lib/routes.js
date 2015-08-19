var Actin = require('actin');
var Handlebars = require('handlebars');

exports.register = function (plugin, options, next) {

    var AutoLoader = new Actin();
    plugin.dependency('controllers');
    plugin.dependency('models');

    var Controllers = AutoLoader.controllersSync({folderName: '/controllers/handlers'});
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
        
        { method: 'GET',  path: '/v1/downloads/{name}', config: Controllers.Plugin.getDownloadCounts },
        { method: 'GET',  path: '/v1/downloads', config: Controllers.Plugin.getHottestPlugins },


        // Assets & Static Routes
        { method: 'GET',  path: '/css/{path*}', handler: Controllers.Static.css },
        { method: 'GET',  path: '/img/{path*}', handler: Controllers.Static.img },
        { method: 'GET',  path: '/js/{path*}', handler: Controllers.Static.js },
        { method: 'GET',  path: '/favicon.ico', handler: Controllers.Static.favicon },
        { method: 'GET',  path: '/heartbeat', config: Controllers.Static.heartbeat }
    ]);

    if (!process.env.PRODUCTION) {
        plugin.route([
            { method: 'GET',  path: '/admin/plugins/populate', config: Controllers.Plugin.populate },
            { method: 'GET',  path: '/admin/plugins/populate/file', config: Controllers.Plugin.populate },
            { method: 'GET',  path: '/admin/plugins/populate/source', config: Controllers.Plugin.populateReal },
        ]);
    }

    plugin.views({
        engines: {
            html: {
                module: Handlebars
            }
        },
        path: __dirname + '/views'
    });

    next();
};



exports.register.attributes = {
    name: 'routes',
    version: require('../package.json').version
};
