// Load modules

var Code = require('code');
var Lab = require('lab');
var HapiPlugins = require('../');


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;


describe('Authentication', function () {
    it('supports github', function (done) {
        HapiPlugins.init(function (err, server) {

            done();
        });
    });
});