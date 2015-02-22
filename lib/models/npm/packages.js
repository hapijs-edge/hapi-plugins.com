var Hoek = require('hoek');
var Wreck = require('wreck');

function NpmPackages (options) {
    this.options = Hoek.applyToDefaults(NpmDownloads._defaults, options || {});
}

NpmPackages._defaults = {
    host: 'https://api.npmjs.org',
    uris: {
        
    }
};


// NpmPackages.prototype.getPackageFactory = function (_type, range) {
//     var self = this;
//     return function (moduleName, callback) {
//         var method = "GET";
//         var uri = self.options.host + self.options.uris[range](moduleName);
//         var options = {
//             redirects: 3,
//             timeout: 30000,
//             rejectUnauthorized: true
//         };
        
//         var processResponse = function (err, body) {
//             // Leave room in case response modification required
//             return callback(err, body);
//         };
        
//         var readResponse = function (err, res) {
//             if (err) {
//                 return callback(err);
//             }
            
//             Wreck.read(res, {json:true}, processResponse);
//         };
        
//         var req = Wreck.request(method, uri, options, readResponse);
//     };
// };




module.exports = NpmPackages;