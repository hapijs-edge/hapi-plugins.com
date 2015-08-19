// Load modules

var Glue = require('glue');
var Hapi = require('hapi');
var Config = require('../config.json');


// Internals

var internals = {
    manifest: {
        connections: [{
            port: Config.port || 8080,
            labels: ['http']
        },
        {
            port: Config.apiPort || 8088,
            labels: ['api']
        }],
        plugins: {
            bell: [{ 'select': 'http' }],
            'hapi-auth-cookie': [{ 'select': 'http' }],
            './authentication': [{ 'select': 'http' }],
            './controllers': [{ 'select': ['http', 'api' ]}],
            './models': [{ 'select': ['http', 'api']}],
            './routes': [{ 'select': ['http']}],
            './api': [{ 'select': ['api']}],
            good: {
                opsInterval: 5000,
                reporters: [
                    { 'reporter': 'good-console', 'events': { 'log': '*' } }
                ]
            }
        }
    }
};
if (!process.env.PRODUCTION) {
    internals.manifest.plugins['blipp'] = [{}];
    internals.manifest.plugins['good'].reporters[0].events['ops'] =  '*';
}


Glue.compose(internals.manifest, { relativeTo: __dirname }, function (err, pack) {

    if (err) {
        console.log('server.register err:', err);
    }
    pack.start(function(){
        console.log('✅  Server is listening on ' + pack.info.uri.toLowerCase());
    });
});
