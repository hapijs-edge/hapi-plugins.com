exports.register = function (plugin, options, next) {

    // plugin.auth.scheme('isAdmin', AdminScheme);
    // plugin.auth.strategy('admin', 'isAdmin');
    
    next();
};

exports.register.attributes = {
    name: 'authentication',
    version: require('../../package.json').version
};