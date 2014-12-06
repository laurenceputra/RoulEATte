localizr
========

Experiments with the guts of makara.

[![Build Status](https://travis-ci.org/krakenjs/localizr.svg)](https://travis-ci.org/krakenjs/localizr)

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
