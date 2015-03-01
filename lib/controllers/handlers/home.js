var funnyQuotes = [
    // This section is just for you Ben Acker.
];

var spockQuotes = [
    "The needs of the many outweigh the needs of the few, or the one.",
    "Insults are effective only where emotion is present.",
    "Live long, and prosper.",
    "Without followers, evil cannot spread.",
    "I have been and always shall be your friend.",
];


var quotes = [
    'Lovingly hand-crafted in California, Oregon, and Missouri.',
].concat(funnyQuotes).concat(spockQuotes);

module.exports.get = {
    handler: function (request, reply) {
        reply.view('index', {
            finalmsg: quotes[Math.floor(Math.random()*quotes.length)]
        });
    }
};