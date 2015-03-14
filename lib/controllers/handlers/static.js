exports.css = {
    directory: {
        path: __dirname + '/../../public/css',
        listing: true
    }
};


exports.img = {
    directory: {
        path: __dirname + '/../../public/img',
        listing: true
    }
};


exports.js = {
    directory: {
        path: __dirname + '/../../public/js',
        listing: true
    }
};


exports.favicon = {
    file: __dirname + '/../../public/favicon.ico'
};


exports.heartbeat = {
    handler: function (request, reply) {
        reply('OK');
    }
};
