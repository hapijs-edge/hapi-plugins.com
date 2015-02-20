// Load modules

var Code = require('code');
var Lab = require('lab');
// var HapiPlugins = require('../');
var NpmDownloads = require('../../../../lib/models/npm/downloads');


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;


describe('NpmDownloads', function () {

    describe('#lastDay', function () {
        it('can grab hapi statistics for lastDay', function (done) {
            var NpmDownloadsService = new NpmDownloads();
            NpmDownloadsService.lastDay('hapi', function (err, response){
               // console.log(err, response);
               expect(err).to.not.exist();
               expect(response).to.exist();
               done();
            });
        });
    });
    

    describe('#lastWeek', function () {
        it('can grab hapi statistics for lastWeek', function (done) {
            var NpmDownloadsService = new NpmDownloads();
            NpmDownloadsService.lastWeek('hapi', function (err, response){
               // console.log(err, response);
               expect(err).to.not.exist();
               expect(response).to.exist();
               done();
            });
        });
    });
    
    
    describe('#lastMonth', function () {
        it('can grab hapi statistics for lastMonth', function (done) {
            var NpmDownloadsService = new NpmDownloads();
            NpmDownloadsService.lastMonth('hapi', function (err, response){
               // console.log(err, response);
               expect(err).to.not.exist();
               expect(response).to.exist();
               done();
            });
        });
    });
    
    
    describe('#lastYear', function () {
        it('can grab hapi statistics for lastYear', function (done) {
            var NpmDownloadsService = new NpmDownloads();
            NpmDownloadsService.lastYear('hapi', function (err, response){
               // console.log(err, response);
               expect(err).to.not.exist();
               expect(response).to.exist();
               done();
            });
        });
    });
});
