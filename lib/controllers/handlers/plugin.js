// Load modules

var FS = require('fs');
var _ = require('lodash');
var Async = require('async');
var Boom = require('boom');
var Hoek = require('hoek');
var Joi = require('joi');
var Xss = require('xss');
var DB = require('../../db');


// Declare internals

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
        return reply('yeah, so... done.');
    }
};


var NameMatchSuffix = /[-]hapi/ig;
var NameMatchPrefix = /hapi[-]/ig;
module.exports.populate = {
    // auth: 'session',
    handler: function (request, reply) {

        var results = require('../../../hapi-plugins.json');
        DB.plugin.batchCreate(results, function (err, success) {

            if (err) {
                throw err;
            }
            return reply("<pre>" + JSON.stringify(results, null, 2) + "</pre>");
        });
    }
};

module.exports.populateReal = {
    timeout: {
        server: 15*60*1000,
        socket: 20*60*1000
    },
    handler: function (request, reply) {

        var NPMPackages = new this.models.npm.Packages();
        var NPMDownloads = new this.models.npm.Downloads();
        Async.parallel({
            shortlist: function(cb) { return NPMPackages.getShortList(cb); },
            hapiKeyword: function(cb){ return NPMPackages.getByKeyword('hapi', cb); },
            hapijsKeyword: function(cb){ return NPMPackages.getByKeyword('hapijs', cb); },
            hapidotjsKeyword: function(cb){ return NPMPackages.getByKeyword('hapi.js', cb); },
        }, function (err, results){

            if (err) {
                throw err; // TODO: replace with boom err
            }

            var shortlist = results.shortlist.rows.filter(function(module){

                return NameMatchPrefix.exec(module.id) || NameMatchSuffix.exec(module.id);
            }).map(function(module){

                return module.id;
            });

            var hapiKeyword = results.hapiKeyword.rows.map(function(module){

                return module.key[1];
            });
            var hapijsKeyword = results.hapijsKeyword.rows.map(function(module){

                return module.key[1];
            });
            var hapidotjsKeyword = results.hapidotjsKeyword.rows.map(function(module){

                return module.key[1];
            });

            var plugins = _.uniq(shortlist.concat(hapiKeyword).concat(hapijsKeyword).concat(hapidotjsKeyword));

            function getPluginData (name, callback) {

                NPMPackages.getByName(name, callback);
            }

            Async.map(plugins, getPluginData, function (err, results){

                if (err) {
                    throw err;
                }

                results = results.filter(function(result){

                    if (result.time.hasOwnProperty('unpublished')) {
                        if (new Date(result.time.unpublished.time) > new Date(result.time.modified)) {
                            return false;
                        }
                    }
                    return true;
                });

                DB.plugin.batchCreate(results, function (err, success) {

                    if (err) {
                        throw err;
                    }
                    
                    DB.download.remove({}, function(){
                        Async.map(results, internals.updateDownloadCounts(NPMDownloads), function(err, output){
                            if (err) {
                                throw err;
                            }
                            
                            return reply("<pre>" + JSON.stringify(results, null, 2) + "</pre>");
                        });
                    });
                });
            });
        });
    }
};

var search_cache = {};
var search_cache_date = Date.now();

module.exports.search = {
    validate: {
        query: {
            q: Joi.string(),
            sort: Joi.string().optional(),
            fields: Joi.string().optional()
        }
    },
    response: {
        schema: Joi.array().includes(Joi.object().keys({
            name: Joi.string().required(),
            authors: Joi.array().optional(),
            keywords: Joi.array().optional(),
            dependencies: Joi.array().optional(),
            dependents: Joi.array().optional(),
            homepage: Joi.string().allow(''),
            version: Joi.string().optional().allow(''),
            license: Joi.string().optional().allow(''),
            description: Joi.string().optional().allow(''),
            downloads: Joi.number().optional()
        }))
    },
    handler: function (request, reply) {

        var query = null;
        var sort = null;
        if (request.query.q) {
            query = Xss(request.query.q);
        }
        if (request.query.sort) {
            sort = Xss(request.query.sort);
        }
        var NPMDownloads = new this.models.npm.Downloads();
        if (search_cache[query]) {
            var today = Date.now(); 
            if (today - search_cache_date >= 86400000) {
                search_cache_date = today;
            } else {
                return reply(search_cache[query]);
            }
        }
        
        DB.plugin.search(query, sort, function (err, results){

            if (err) {
                console.log(err);
                return reply({status:-1, error: err}).code(500);
            }
            
            var converted =  internals.convert(results);
            Async.map(converted, internals.getDownloadCounts(NPMDownloads), function(err, results){
                if (err) {
                    return reply({status: -1, data: err}).code(500);
                }
                
                search_cache[query] = results;
                return reply(results);
            });
        });
    }
};


module.exports.getDownloadCounts = {
    // validate: {
    //     param: {
            
    //     }
    // }
    handler: function (request, reply) {

        var modulename = request.params.name;
        var NPMDownloads = new this.models.npm.Downloads();
        
        Async.parallel({
            'last-day': function(cb){ return NPMDownloads.lastDay(modulename, cb); },
            'last-month': function(cb){ return NPMDownloads.lastMonth(modulename, cb); },
            'last-week': function(cb){ return NPMDownloads.lastWeek(modulename, cb); },
            // 'last-year': function(cb){ return NPMDownloads.lastYear(modulename, cb); },
        }, function (err, results){
            if (err) {
                return reply({status: -1, data: err}).code(500);
            }
            
            reply({status: 200, data: results});
        });
    }
};

module.exports.getHottestPlugins = {

    handler: function (request, reply) {
        DB.download.hottest(function(err, results){
            reply(results.map(function(d){
                var output = {
                    name: d.name,
                    downloads: d['last-month']
                };
                return output;
            }));
        });
    }
}

internals.convert = function (results) {

    var pluginData = [];

    for (var i = 0, il = results.length; i < il; ++i) {
        var result = results[i];

        pluginData.push({
            name: result.name,
            keywords: result.keywords,
            authors: result.authors,
            dependents: result.dependents,
            dependencies: result.dependencies,
            description: result.description,
            license: result.license || '',
            homepage: result.homepage,
            version: result.version
        });
    }

    return pluginData;
};


internals.getDownloadCounts = function (DownloadModel) {

    return function (item, callback) {
        DownloadModel.lastWeek(item.name, function(err, count){
            item.downloads = count;
            return callback(err, item);
        });
    }
};

internals.updateDownloadCounts = function (DownloadModel) {

    return function (item, callback) {

        Async.parallel({
            'last-day': function(cb){ return DownloadModel.lastDay(item.name, cb); },
            'last-month': function(cb){ return DownloadModel.lastMonth(item.name, cb); },
            'last-week': function(cb){ return DownloadModel.lastWeek(item.name, cb); }
        }, function (err, results){

            if (err) {
                // skip
                return callback(null, results);
            }
            
            var DLRecord = new DB.download({
                name: item.name,
                'last-day': results['last-day'],
                'last-week': results['last-week'],
                'last-month': results['last-month']
            });
            
            var obj = DLRecord.toObject();
            delete obj._id;
            
            DB.download.update({_id: DLRecord.id || DLRecord._id}, obj, {upsert: true}, function(err){
                return callback(err, item);
            });
        });
    }
}
