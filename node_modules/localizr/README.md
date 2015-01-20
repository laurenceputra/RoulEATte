localizr
========

Lead Maintainer: [Aria Stewart](https://github.com/aredridel)  

[![Build Status](https://travis-ci.org/krakenjs/localizr.svg?branch=master)](https://travis-ci.org/krakenjs/localizr)

A library and tool to apply localization to dust templates before rendering.

It applies the contents of 'content bundles' to `{@pre}` tags in dust templates, as first described in [Makara's README](https://github.com/krakenjs/makara/blob/master/README.md)

Use
----

```bash
$ npm install -g localizr
$ localizr --props=content/index.properties --out=templates/out templates/index.dust
```

```javascript
var fs = require('fs'),
    localizr = require('localizr');

var out, options;

out = path.join(__dirname, 'templates', 'out', 'index.dust');
options = {
  src: path.join(__dirname, 'templates', 'index.dust'),
  props: path.join(__dirname, 'content', 'index.properties')
};

localizr.createReadStream(options).pipe(fs.createWriteStream(out));
```
