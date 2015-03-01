var internals = {};

internals.funnyQuotes = [
    // This section is just for you, Ben Acker.
];

// In memory of Leonard Nimoy
internals.spockQuotes = [
    "The needs of the many outweigh the needs of the few, or the one.",
    "Insults are effective only where emotion is present.",
    "Live long, and prosper.",
    "Without followers, evil cannot spread.",
    "I have been and always shall be your friend.",
];

internals.footerQuotes = [
    'Lovingly hand-crafted in California, Oregon, and Missouri.'
];

var quotes = internals.footerQuotes.concat(internals.funnyQuotes).concat(internals.spockQuotes);

module.exports.get = {
    handler: function (request, reply) {

        reply.view('index', {
            finalmsg: internals.quotes[Math.floor(Math.random()*internals.quotes.length)]
        });
    }
};