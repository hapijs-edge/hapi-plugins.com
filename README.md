<a href="https://en.wikipedia.org/wiki/JavaScript">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/768px-JavaScript-logo.png"
        alt="JavaScript"
        align="right"
        width="82px"/>
</a>

[![Build Status](https://travis-ci.org/hapijs-edge/hapi-plugins.com.svg?branch=master)](https://travis-ci.org/hapijs-edge/hapi-plugins.com)

# Introduction

<img src="https://hapi-plugins.com/img/hapi-edge-cover.jpg"
    alt="hapi edge book cover"
    title="hapi edge book cover"
    align="right"
    width="180px"/>

[Hapi-Plugins.com](https://hapi-plugins.com) is a searchable database of [Hapi.js](http://hapijs.com/) plugins. It was made for the book [Developing a hapi Edge](http://shop.oreilly.com/product/9781939902207.do) by:

- [Van Nguyen](https://twitter.com/thegoleffect)
- [Daniel Bretoi](https://twitter.com/Eydaimon)
- [Wyatt Preul](https://twitter.com/wpreul)
- [Lloyd Benson](https://twitter.com/LloydWith2Ls)

This application was built from the beginning as open-source. Go ahead: Fork it and make it better!

# Topics

- [Quick Start](#quick-start)
- [Options](#options)
- [Troubleshooting](#troubleshooting)
- [License](#license)

# Quick Start

```
git clone https://github.com/hapijs-edge/hapi-plugins.com.git
cd hapi-plugins.com
npm install
npm run start
```

Then, open your browser to `http://localhost:8080` to view your local copy of the web application. The first time a query is searched, it will take a few seconds and subsequent re-searches will feel instantaneous after the cache is warmed up.

# Options

## Environment Variables

- `PRODUCTION`
    - The `PRODUCTION=1 npm run start` env variable will disable console output of route table and [`good`](http://github.com/hapijs/good) runtime statistics.
- `DEVELOPMENT`
    - The `DEVELOPMENT=1 npm run start` env variable will disable the public mongodb database and attempt to connect to a local mongodb.

## Config.json

- `port`
    - The port to run the web server (defaults to 8080).
- `apiPort`
    - DEPRECATED: The port to run the api server (defaults to 8088).
- `database`
    - `mongodb`
        - `host`
            - The mongodb host connection string (defaults to public mongodb).
        - `username`
            - The username with which to connect to the host.
        - `password`
            - The password with which to connect to the host.


# Troubleshooting

### The search results are always empty

If the search results are empty and you are using the public mongodb instance, most likely some troll deleted everything. To repopulate visit `HOST + '/admin/plugins/populate/source'` in your browser where HOST is how you normally connect to hapi-plugins (default is `http://localhost:8080`).


# License

The ISC License

Copyright (c) 2015, Lloyd Benson, Daniel Bretoi, Van Nguyen, Wyatt Preul

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.