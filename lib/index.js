var Bell = require('bell');
var Hapi = require('hapi');
var Hoek = require('hoek');
var HapiAuthCookie = require('hapi-auth-cookie');
var Authentication = require('./authentication');
var Controllers = require('./controllers');
var Models = require('./models');
var Routes = require('./routes');

// TODO: move this configuration to file
var cfg = {
    server: {
        port: 8080,
        host: '0.0.0.0'
    },
    options: {
        files: {
            relativeTo: __dirname
        }
    }
};

var server;

exports.init = function (callback) {

    if (server) {
        return callback(null, server);
    }

    server = new Hapi.Server();
    server.connection(cfg.server);
    server.path(cfg.options.files.relativeTo);

    server.on('request-error', function (request, response) {

        console.log('request-error:');
        console.dir(response);
    });

    server.register([
            Bell,
            HapiAuthCookie,
            Authentication,
            Controllers,
            Models,
            Routes
        ],
        function (err) {
            if (err) {
                console.log('server.register err:', err);
                return callback(err);
            }

            server.start(function() {
                console.log('server started on port: ', server.info.port);
                return callback(null, server);
            });
        }
    );
};

exports.init(Hoek.ignore);
