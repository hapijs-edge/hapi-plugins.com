exports.css = {
    directory: {
        path: __dirname + '/../../public/css',
        index: false
    }
};


exports.img = {
    directory: {
        path: __dirname + '/../../public/img',
        index: false
    }
};


exports.js = {
    directory: {
        path: __dirname + '/../../public/js',
        index: false
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
