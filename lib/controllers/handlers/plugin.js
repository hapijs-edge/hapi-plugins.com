var FS = require('fs');
var Async = require('async');
var Boom = require('boom');
var DB = require('../../db');
var Hoek = require('hoek');

var internals = {};

module.exports.getUpload = {
    description: 'Page displayed for upload',
    handler: function (request, reply) {
        reply.view('upload');
    }
};

module.exports.download = {
    handler: function (request, reply) {
        reply.view('upload');
    }
};

module.exports.edit = {
    handler: function (request, reply) {
        reply.view('upload');
    }
};

module.exports.like = {
    handler: function (request, reply) {

        var pluginName = request.params.name;

        var username = Hoek.reach(request, 'credentials.username');
        username = 'test'
        if (!username) {
            return reply(Boom.unauthorized());
        }

        var getOrCreateUser = function (next) {

            DB.user.get(username, function (err, user) {

                if (!user) {
                    var user = new DB.user({ username: username});
                    user.save(function (err) {

                        if (err) {
                            return next(err);
                        }
                        return next(null, user);
                    })
                }
                else {
                    return next(null, user);
                }
            });
        };

        var getPlugin = function (user, next) {

            DB.plugin.get(pluginName, function (err, plugin) {

                if (err || !plugin) {
                    return next(Boom.notFound('no such plugin found'));
                }

                return next(null, plugin, user);
            });
        };

        var addLike = function (plugin, user, next) {

            user.like(plugin, function (err) {

                return next(err);
            });
        };

        Async.waterfall([
                        getOrCreateUser,
                        getPlugin,
                        addLike
        ], function (err, result) {

            if (err) {
                return reply(err)
            }
            return reply({success: true});
        });
    }
};

module.exports.get = {
    handler: function (request, reply) {
        reply.view('upload');
    }
};

module.exports.postUpload = {
    description: 'Post a file for upload',
    payload:{
        maxBytes: 209715200,
        output:'stream',
        parse: true
    },
    handler: function (request, reply) {
        request.payload.datafile.pipe(FS.createWriteStream("out"));
        reply('yeah, so... done.');
    }
};
