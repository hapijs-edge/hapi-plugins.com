// Load modules

var Code = require('code');
var Lab = require('lab');
var HapiPlugins = require('../');


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;


describe('Hapi Plugins', function () {
   it('Server can be started', function (done) {
       HapiPlugins.init(function (err, server) {
           expect(err).to.not.exist();
           expect(server).to.exist();
           done();
       });
   });

   it('can like a plugin', function (done) {

       HapiPlugins.init(function (err, server) {

           var options = {
               url: '/plugins/1/like',
               method: 'GET'
           };

           server.inject(options, function (err, result) {

               // console.log(err);
               // console.log(result);
               expect(err).to.not.exist();
               expect(server).to.exist();
               done();
           });
       });
   });
});
