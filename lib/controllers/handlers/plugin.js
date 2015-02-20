var FS = require('fs');

module.exports.getUpload = {
    description: 'Page displayed for upload',
    handler: function (request, reply) {
        reply.view('upload');
    }
};

module.exports.download = {
    handler: function (request, reply) {
        reply.view('upload');
    }
};

module.exports.edit = {
    handler: function (request, reply) {
        reply.view('upload');
    }
};

module.exports.like = {
    handler: function (request, reply) {

        return reply('moop');
        reply.view('upload');
    }
};

module.exports.get = {
    handler: function (request, reply) {
        reply.view('upload');
    }
};

module.exports.postUpload = {
    description: 'Post a file for upload',
    payload:{
        maxBytes: 209715200,
        output:'stream',
        parse: true
    },
    handler: function (request, reply) {
        request.payload.datafile.pipe(FS.createWriteStream("out"));
        reply('yeah, so... done.');
    }
};
