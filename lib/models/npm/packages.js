var Hoek = require('hoek');
var Wreck = require('wreck');
var Util = require('util');

var internals = {};

internals.NpmPackages = function (options) {
    this.options = Hoek.applyToDefaults(internals.NpmPackages._defaults, options || {});
};

internals.NpmPackages._defaults = {
    host: 'https://registry.npmjs.org',
    hostShortList: 'https://skimdb.npmjs.com',
    uris: {
        byShortList: function () { return "/registry/_all_docs"; },
        byName: function (n) { return Util.format("/%s/latest", n); },
        byKeyword: function (kw) { return Util.format('/-/_view/byKeyword?startkey=["%s"]&endkey=["%s",{}]&group_level=3', kw, kw); },
        byDependedUpon: function (kw) { return Util.format('/-/_view/dependedUpon?group_level=3&startkey=["%s"]&endkey=["%s", {}]&skip=0&limit=1000', kw, kw); }
    }
};


internals.NpmPackages.prototype.getShortList = function (callback) {
    var method = "GET";
    var uri = this.options.hostShortList + this.options.uris.byShortList();
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


internals.NpmPackages.prototype.getByName = function (name, callback) {
    var method = "GET";
    var uri = this.options.host + this.options.uris.byName(name);
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


internals.NpmPackages.prototype.getByKeyword = function (keyword, callback) {
    var method = "GET";
    var uri = this.options.host + this.options.uris.byKeyword(keyword);
    var options = {
        redirects: 3,
        timeout: 30000,
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
    
    var req = Wreck.request(method, uri, options, readResponse);
};


internals.NpmPackages.prototype.getDependedUpon = function (keyword, callback) {
    var method = "GET";
    var uri = this.options.host + this.options.uris.byDependedUpon(keyword);
    var options = {
        redirects: 3,
        timeout: 30000,
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
    
    var req = Wreck.request(method, uri, options, readResponse);
};


module.exports = internals.NpmPackages;