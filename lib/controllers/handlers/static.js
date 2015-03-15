exports.css = {
    directory: {
        path: __dirname + '/../../public/css'
    }
};


exports.img = {
    directory: {
        path: __dirname + '/../../public/img'
    }
};


exports.js = {
    directory: {
        path: __dirname + '/../../public/js'
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
