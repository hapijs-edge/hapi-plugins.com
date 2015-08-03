var Hoek = require('hoek');
var Wreck = require('wreck');

var internals = {};

internals._defaults = {
    host: 'https://api.npmjs.org',
    uris: {
        'last-day': function(_module) { return '/downloads/point/last-day/' + _module; },
        'last-week': function(_module) { return '/downloads/point/last-week/' + _module; },
        'last-month': function(_module) { return '/downloads/point/last-month/' + _module; },
        'last-year': function(_module) {
            var today = new Date();
            var from = [today.getFullYear() - 1, ('0' + (today.getMonth() + 1)), ('0' + today.getDate()).slice(-2)].join('-');
            var to = [today.getFullYear(), ('0' + (today.getMonth() + 1)), ('0' + today.getDate()).slice(-2)].join('-');
            var dateRange = [from, to].join(':');
            return '/downloads/point/' + dateRange + "/" + _module; }
    }
};


internals.NpmDownloads = function  (options) {
    
    var Downloads = function (override) {
        this.options = Hoek.applyToDefaults(internals._defaults, options || {});
    }
    
    Downloads.prototype.getDownloadsBy = function (_type, range) {
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
                var output = body.downloads || 0;
                return callback(err, output);
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


    Downloads.prototype.lastDay = function (moduleName, callback) {
        return this.getDownloadsBy('point', 'last-day')(moduleName, callback);
    };

    Downloads.prototype.lastWeek = function (moduleName, callback) {
        return this.getDownloadsBy('point', 'last-week')(moduleName, callback);
    };

    Downloads.prototype.lastMonth = function (moduleName, callback) {
        return this.getDownloadsBy('point', 'last-month')(moduleName, callback);
    };

    Downloads.prototype.lastYear = function (moduleName, callback) {
        return this.getDownloadsBy('point', 'last-year')(moduleName, callback);
    };
    
    return Downloads;
};


module.exports = internals.NpmDownloads;