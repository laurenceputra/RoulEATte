'use strict';
var path = require('path'),
    fs = require('fs');

module.exports = {

    getName: function getName (filePath, root) {
        var fileInfo = {},
            relative = module.exports.getRelative(filePath, root),
            paths;

        return relative.replace(path.extname(relative), '');
    },

    getRelative: function getRelative (filePath, root) {
        var relative = filePath.replace(root, '');
        return relative.substr(1);
    }
};