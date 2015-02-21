
exports.register = function (plugin, options, next) {

    plugin.auth.strategy('github', 'bell', {
        provider: 'github',
        password: 'password',
        isSecure: false,
        clientId: '35c8883e92b62df9be91',
        clientSecret: 'a4ab9f45c816c1e1068e0ba6ed664a5e7c844b73'
    });

    // Remove later
    plugin.route({
        method: '*',
        path: '/auth/callback',
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
