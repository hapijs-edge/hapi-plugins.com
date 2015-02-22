// Load modules

var Code = require('code');
var Lab = require('lab');
var HapiPlugins = require('../');
var DB = require('../lib/db');


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;
var beforeEach = lab.beforeEach;


describe('Hapi Plugins', function () {

    beforeEach(function (done) {
        DB.plugin.remove(function (err) {
            DB.user.remove(function (err) {
                done();
            });
        });
    });

    it('Server can be started', function (done) {
        HapiPlugins.init(function (err, server) {
            expect(err).to.not.exist();
            expect(server).to.exist();
            done();
        });
    });

    it('can like a plugin', function (done) {

        HapiPlugins.init(function (err, server) {

            var plugin =  DB.plugin({
                name: 'purdy',
                license: 'MIT',
                version: '1.0.1',
                description: 'a niceties plugin',
                authors: ['daniel']
            });

            var options = {
                url: '/plugins/purdy/like',
                method: 'GET'
            };

            plugin.save(function (err) {

                expect(err).to.not.exist();

                server.inject(options, function (response) {

                    expect(err).to.not.exist();
                    expect(response.result.success).to.equal(true);
                    expect(server).to.exist();
                    done();
                });
            });

        });
    });
>>>>>>> 00fa59dde51cd2bc90f6b50103a73c6e1d790d9b
});
