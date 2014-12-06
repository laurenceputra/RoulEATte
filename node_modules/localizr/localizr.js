#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    localizr = require('./'),
    mkdirp = require('mkdirp');
    minimist = require('minimist');


var argv, options, src, props, out;

argv = minimist(process.argv.slice(2));
if (!argv._.length && !argv.props && !argv.out) {
    console.log('usage: localizr --props=<file> --out=<file> file');
    return;
}

src = path.resolve(argv._[0]);
props = path.resolve(argv.props);
out = path.resolve(argv.out);

// If no filename, use src filename
if (!path.extname(out)) {
    out = path.join(out, path.basename(src));
}

mkdirp(path.dirname(out), function (err) {
    if (err) {
        console.error(err);
        return;
    }
    localizr.createReadStream({ src: src, props: props }).pipe(fs.createWriteStream(out));
});

