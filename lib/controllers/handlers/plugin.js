var _ = require('lodash');
var FS = require('fs');
var Async = require('async');
var Boom = require('boom');
var DB = require('../../db');
var Hoek = require('hoek');
var Joi = require('joi');

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
    auth: 'session',
    handler: function (request, reply) {

        var pluginName = request.params.name;

        var username = request.auth.credentials.username;
        if (!username) {
            return reply(Boom.unauthorized());
        }

        // return reply('ok');

        // var getOrCreateUser = function (next) {

        //     DB.user.get(username, function (err, user) {

        //         if (!user) {
        //             var user = new DB.user({ username: username});
        //             user.save(function (err) {

        //                 if (err) {
        //                     return next(err);
        //                 }
        //                 return next(null, user);
        //             })
        //         }
        //         else {
        //             return next(null, user);
        //         }
        //     });
        // };

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
                return reply(err);
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


var NameMatchSuffix = /[-]hapi/ig;
var NameMatchPrefix = /hapi[-]/ig;
module.exports.populate = {
    auth: 'session',
    handler: function (request, reply) {
        var results = require('../../../hapi-plugins.json');

        return DB.plugin.batchCreate(results, function (err, success) {

            if (err) {
                throw err;
            }
            return reply("<pre>" + JSON.stringify(results, null, 2) + "</pre>");
        });

        // var NPMPackages = new this.models.npm.Packages();
        // Async.parallel({
        //     shortlist: function(cb) { return NPMPackages.getShortList(cb); },
        //     hapiKeyword: function(cb){ return NPMPackages.getByKeyword('hapi', cb); },
        //     hapijsKeyword: function(cb){ return NPMPackages.getByKeyword('hapijs', cb); },
        //     hapidotjsKeyword: function(cb){ return NPMPackages.getByKeyword('hapi.js', cb); },
        // }, function (err, results){
        //     if (err) {
        //         throw err; // TODO: replace with boom err
        //     }

        //     var shortlist = results.shortlist.rows.filter(function(module){
        //         return NameMatchPrefix.exec(module.id) || NameMatchSuffix.exec(module.id);
        //     }).map(function(module){
        //         return module.id;
        //     });

        //     var hapiKeyword = results.hapiKeyword.rows.map(function(module){
        //         return module.key[1];
        //     });
        //     var hapijsKeyword = results.hapijsKeyword.rows.map(function(module){
        //         return module.key[1];
        //     });
        //     var hapidotjsKeyword = results.hapidotjsKeyword.rows.map(function(module){
        //         return module.key[1];
        //     });

        //     var plugins = _.uniq(shortlist.concat(hapiKeyword).concat(hapijsKeyword).concat(hapidotjsKeyword));

        //     function getPluginData (name, callback) {
        //         NPMPackages.getByName(name, callback);
        //     }

        //     Async.map(plugins, getPluginData, function (err, results){
        //         if (err) {
        //             throw err;
        //         }
                
        //         results = results.filter(function(d){
        //             if (d.time.hasOwnProperty('unpublished')) {
        //                 if (new Date(d.time.unpublished.time) > new Date(d.time.modified)) {
        //                     return false;
        //                 }
        //             }
        //             return true;
        //         });
                

        //         // FS.writeFileSync('muppet', JSON.stringify(results, null, 2));
        //         DB.plugin.batchCreate(results, function (err, success) {

        //             if (err) {
        //                 throw err;
        //             }
        //             reply("<pre>" + JSON.stringify(results, null, 2) + "</pre>");
        //         });
        //     });
        // });
    }
};

module.exports.search = {
    validate: {
        query: {
            q: Joi.string(),
            sort: Joi.string().optional(),
            fields: Joi.string().optional()
        }
    },
    handler: function (request, reply) {
        DB.plugin.search(request.query.q, request.query.sort, function (err, results){
            reply(JSON.stringify(results, null, 2));
        });
    }
};
