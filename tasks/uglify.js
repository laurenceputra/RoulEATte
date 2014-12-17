'use strict';


module.exports = function uglify(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Options
    return {
        mainJS:{
            files: [{
                expand:true,
                cwd: 'public/js/',
                src: ['*.js'],
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
