'use strict';


module.exports = function uglify(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Options
    return {
        options:{
            report: 'min',
        },
        mainJS:{
            files: [{
                expand:true,
                cwd: 'public/js/',
                src: ['*.js', '!*_templates.js'],
                dest: '.build/js/',
            }]
        },
        dustJS:{
            files: {
                '.build/js/en_US_templates.js': ['.build/templates/US/en/**/*.js']
            }
        }
    };
};
