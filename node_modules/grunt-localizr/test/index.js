'use strict';
var grunt = require('grunt'),
    test = require('tape'),
    path = require('path'),
    fs = require('fs'),
    rimraf = require('rimraf');


test('Grunt-localizr', function (t) {
    process.chdir(path.join(process.cwd(), 'test', 'fixtures'));
    grunt.task.init = function() {};

    grunt.initConfig({
        localizr: {
            files: ['public/templates/**/*.dust'],
            options: {
                contentPath: ['locales/**/*.properties']
            }
        }
    });

    t.test('test a localizr build', function(t) {


        require('../tasks/index')(grunt);
        grunt.tasks(['localizr'], {}, function(){
            //verify the files exist
            t.equal(true, fs.existsSync('./tmp/ES/es/nested/test.dust'));
            t.equal(true, fs.existsSync('./tmp/US/en/nested/test.dust'));
            t.equal(true, fs.existsSync('./tmp/ES/es/nested/test1.dust'));
            t.equal(true, fs.existsSync('./tmp/US/en/nested/test1.dust'));

            //verify they have expected content
            t.equal('<div>Hola</div>', fs.readFileSync('./tmp/ES/es/nested/test.dust', 'utf8'));
            t.equal('<div>Hello</div>', fs.readFileSync('./tmp/US/en/nested/test.dust', 'utf8'));
            t.equal('<div>Test with no Locale </div>', fs.readFileSync('./tmp/US/en/nested/test1.dust', 'utf8'));
            t.equal('<div>Test with no Locale </div>', fs.readFileSync('./tmp/US/en/nested/test1.dust', 'utf8'));

            rimraf('tmp', function() {
                t.end();
            });

        });
    });
});
