'use strict';


module.exports = function cssmin(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	// Options
	return {
		cssmin:{
			files: [{
				expand:true,
		    	cwd: 'public/css/',
		    	src: ['*.css'],
		    	dest: '.build/css/',
		    }]
		} 
	};
};
