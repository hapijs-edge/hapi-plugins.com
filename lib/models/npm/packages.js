var Hoek = require('hoek');
var Wreck = require('wreck');
var Util = require('util');

var internals = {};

internals._defaults = {
    host: 'https://registry.npmjs.org',
    hostShortList: 'https://skimdb.npmjs.com',
    uris: {
        byShortList: function () { return "/registry/_all_docs"; },
        byName: function (name, version) { 
            if (version) {
                return Util.format("/%s/%s", name, version);
            } else {
                return Util.format("/%s", name);
            } 
        },
        byKeyword: function (kw) { return Util.format('/-/_view/byKeyword?startkey=["%s"]&endkey=["%s",{}]&group_level=3', kw, kw); },
        byDependedUpon: function (kw) { return Util.format('/-/_view/dependedUpon?group_level=3&startkey=["%s"]&endkey=["%s", {}]&skip=0&limit=1000', kw, kw); }
    }
};

internals.NpmPackages = function (options) {
    
    var Packages = function (override) {
        this.options = Hoek.applyToDefaults(internals._defaults, options || {});
        // console.log("this.options", this.options);
    };
    
    Packages.prototype.getShortList = function (callback) {
        var method = "GET";
        var url = this.options.hostShortList + this.options.uris.byShortList();
        var options = {
            redirects: 3,
            timeout: 90000,
            rejectUnauthorized: true
        };
        
        var processResponse = function (err, body) {
            // Leave room in case response modification required
            return callback(err, JSON.parse(body.toString()));
        };
        
        var readResponse = function (err, res) {
            if (err) {
                return callback(err);
            }
            
            Wreck.read(res, {json:true}, processResponse);
        };
        
        var req = Wreck.request(method, url, options, readResponse);
    };


    Packages.prototype.getByName = function (arg, callback) {
        var method = "GET";
        var name = arg;
        var version = null;
        if (arg.indexOf('@') >= 0) {
            var args = arg.split('@');
            name = args[0];
            version = args[1];
        }
        
        var uri = this.options.host + this.options.uris.byName(name, version);
        var options = {
            redirects: 3,
            timeout: 90000,
            rejectUnauthorized: true
        };
        
        var processResponse = function (err, body) {
            // Leave room in case response modification required
            return callback(err, body.rows || body);
        };
        
        var readResponse = function (err, res) {
            if (err) {
                return callback(err);
            }
            
            Wreck.read(res, {json:true}, processResponse);
        };
        
        var req = Wreck.request(method, uri, options, readResponse);
    };


    Packages.prototype.getByKeyword = function (keyword, callback) {
        var method = "GET";
        var uri = this.options.host + this.options.uris.byKeyword(keyword);
        var options = {
            redirects: 3,
            timeout: 30000,
            rejectUnauthorized: true
        };
        
        var processResponse = function (err, body) {
            // Leave room in case response modification required
            return callback(err, body);
        };
        
        var readResponse = function (err, res) {
            if (err) {
                return callback(err);
            }
            
            Wreck.read(res, {json:true}, processResponse);
        };
        
        var req = Wreck.request(method, uri, options, readResponse);
    };


    Packages.prototype.getDependedUpon = function (keyword, callback) {
        var method = "GET";
        var uri = this.options.host + this.options.uris.byDependedUpon(keyword);
        var options = {
            redirects: 3,
            timeout: 30000,
            rejectUnauthorized: true
        };
        
        var processResponse = function (err, body) {
            // Leave room in case response modification required
            return callback(err, body);
        };
        
        var readResponse = function (err, res) {
            if (err) {
                return callback(err);
            }
            
            Wreck.read(res, {json:true}, processResponse);
        };
        
        var req = Wreck.request(method, uri, options, readResponse);
    };
    
    return Packages;
};


module.exports = internals.NpmPackages;