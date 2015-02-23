var Hoek = require('hoek');
var Wreck = require('wreck');

var internals = {};

internals.NpmDownloads = function  (options) {
    this.options = Hoek.applyToDefaults(internals.NpmDownloads._defaults, options || {});
};

internals.NpmDownloads._defaults = {
    host: 'https://api.npmjs.org',
    uris: {
        'last-day': function(_module) { return '/downloads/range/last-day/' + _module; },
        'last-week': function(_module) { return '/downloads/range/last-week/' + _module; },
        'last-month': function(_module) { return '/downloads/range/last-month/' + _module; },
        'last-year': function(_module) {
            var today = new Date();
            var from = [today.getFullYear() - 1,today.getMonth + 1, today.getDate].join('-');
            var to = [today.getFullYear(),today.getMonth + 1, today.getDate].join('-');
            var dateRange = [from, to].join(':');
            return '/downloads/range/' + dateRange + "/" + _module; }
    }
};


internals.NpmDownloads.prototype.getDownloadsBy = function (_type, range) {
    var self = this;
    return function (moduleName, callback) {
        var method = "GET";
        var uri = self.options.host + self.options.uris[range](moduleName);
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
};


internals.NpmDownloads.prototype.lastDay = function (moduleName, callback) {
    return this.getDownloadsBy('point', 'last-day')(moduleName, callback);
};

internals.NpmDownloads.prototype.lastWeek = function (moduleName, callback) {
    return this.getDownloadsBy('point', 'last-week')(moduleName, callback);
};

internals.NpmDownloads.prototype.lastMonth = function (moduleName, callback) {
    return this.getDownloadsBy('point', 'last-month')(moduleName, callback);
};

internals.NpmDownloads.prototype.lastYear = function (moduleName, callback) {
    return this.getDownloadsBy('point', 'last-year')(moduleName, callback);
};


module.exports = internals.NpmDownloads;