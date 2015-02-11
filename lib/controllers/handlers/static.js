exports.css = {
    directory: {
        path: './public/css',
        listing: true
    }
};

exports.js = {
    directory: {
        path: './public/js',
        listing: true
    }
};

exports.heartbeat = {
    handler: function (request, reply) {
        reply('OK');
    }
};