'use strict';


module.exports = function uglify(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Options
	return {
		uglify:{
			files: [{
				expand:true,
		    	cwd: 'public/js/',
		    	src: ['*.js'],
		    	dest: '.build/js/',
		    }]
		} 
	};
};
