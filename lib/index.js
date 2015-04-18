// Load modules

var Glue = require('glue');
var Hapi = require('hapi');


// Internals

var internals = {
    manifest: {
        connections: [{
            port: 8080,
            labels: ["http"]
        },
        {
            port: 8088,
            labels: ["api"]
        }],
        plugins: {
            bell: [{ 'select': 'http' }],
            blipp: [{}],
            'hapi-auth-cookie': [{ 'select': 'http' }],
            './authentication': [{ 'select': 'http' }],
            './controllers': [{ 'select': ['http', 'api' ]}],
            './models': [{ 'select': ['http', 'api']}],
            './routes': [{ 'select': ['http']}],
            './api': [{ 'select': ['api']}],
            good: {
                opsInterval: 5000,
                reporters: [
                    { 'reporter': 'good-console', 'events': { 'ops': '*', 'log': '*' } },
                ]
            }
        }
    }
};


Glue.compose(internals.manifest,  { relativeTo: __dirname }, function (err, pack) {

    if (err) {
        console.log('server.register err:', err);
    }
    pack.start();
});
