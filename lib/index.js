var Async = require('async');
var Hapi = require('hapi');

// TODO: move this configuration to file
var cfg = {
    server: {
        port: 8080,
        host: '0.0.0.0',
    },
    options: {
        files: {
            relativeTo: __dirname
        }
    },
    plugins: {
        'models': {},
        'controllers': {},
        'routes': {}
    }
};

var server = new Hapi.Server();
server.connection(cfg.server);
server.path(cfg.options.files.relativeTo);

function loadPlugin (module) {

    if (typeof module == 'string') {
        var name = module;
        module = require(module);
    }
    
    function stripExtraneous (str) {
        var i = str.indexOf('./');
        if (i >= 0) {
            return str.slice(2);
        }
        return str;
    }

    return function (callback) {

        server.register({register: module}, callback);
    };
}

// function loadHelpers () {

//     server.ext('onPreResponse', function (request, reply) {

//         if (request.query.prettyPrint == "true") {
            
//         }
//     })
// }


Async.series([
    loadPlugin('./authentication'),
    loadPlugin('./models'),
    loadPlugin('./controllers'),
    loadPlugin('./routes'),
    // loadHelpers(),
], function (err){
    if (err) {
        throw err;
    }
    
    server.start(function(){
        console.log('server started on port', server.info.port);
    });
});

