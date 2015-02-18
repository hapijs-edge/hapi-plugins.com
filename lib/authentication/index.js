
exports.register = function (plugin, options, next) {

    plugin.auth.strategy('github', 'bell', {
        provider: 'github',
        password: 'password',
        isSecure: false,
        clientId: 'bdede9fad8112d781b5d',
        clientSecret: '22cd018f20db6c6ce353acebf70a4c47bdd57524'
    });

    // Remove later
    plugin.route({
        method: '*',
        path: '/login',
        config: {
            auth: 'github',
            handler: function (request, reply) {

                reply(request.auth.credentials);
            }
        }
    });
    
    next();
};

exports.register.attributes = {
    name: 'authentication',
    version: require('../../package.json').version
};