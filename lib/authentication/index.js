var DB = require('../db');

exports.register = function (plugin, options, next) {

    plugin.auth.strategy('github', 'bell', {
        provider: 'github',
        password: 'password',
        isSecure: false,
        clientId: '35c8883e92b62df9be91',
        clientSecret: 'a4ab9f45c816c1e1068e0ba6ed664a5e7c844b73'
    });
    
    plugin.auth.strategy('session', 'cookie', {
        cookie: 'hpauth',
        password: 'cookie_password',
        redirectTo: '/',
        isSecure: false,
        validateFunc: function(session, next) {
            DB.user.get(session.username, function (err, user) {

                if (err) {
                    console.log('db.user.get error', err)
                    return next(err);
                }
                
                if (!user) {
                    user = new DB.user({ username: session.username});
                    user.save(function (err) {

                        if (err) {
                            console.log('save err', err)
                            return next(err);
                        }
                        console.log('new user created', user);
                        return next(null, user);
                    });
                }
                else {
                    console.log('user found', user);
                    return next(null, user);
                }
            });
        }
    });

    plugin.route({
        method: '*',
        path: '/login',
        config: {
            auth: 'github',
            handler: function (request, reply){
                reply(request.auth.credentials);
            }
        }
    });
    
    plugin.route({
        method: '*',
        path: '/',
        config: {
            auth: 'session',
            handler: function (request, reply) {
                reply(request.auth.credentials);
            }
        }
    });

    plugin.route({
        method: '*',
        path: '/auth/callback',
        config: {
            auth: 'github',
            handler: function (request, reply) {

                request.auth.session.set({
                    uid: request.auth.credentials.profile.id,
                    username: request.auth.credentials.profile.username,
                    email: request.auth.credentials.profile.email
                });
                reply.redirect('/');
            }
        }
    });

    next();
};

exports.register.attributes = {
    name: 'authentication',
    version: require('../../package.json').version
};
