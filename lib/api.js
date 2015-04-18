exports.register = function (plugin, options, next) {

    plugin.dependency('controllers');
    plugin.dependency('models');

    var Controllers = plugin.plugins.controllers.handlers;
    var Models = plugin.plugins.models.models;
    plugin.bind({
        models: Models
    });

    plugin.route([
        { method: 'GET',  path: '/plugins', config: Controllers.Plugin.search },

    ]);

    next();
};



exports.register.attributes = {
    name: 'api',
    version: require('../package.json').version
};
