// grunt files
module.exports = function (grunt) {
	var watchFiles = {
		serverViews: ['app/views/**/*.*'],
		serverJS: ['gruntfile.js', 'server.js', 'config/*.js', 'app/**/*.js'],
		clientViews: ['public/*.html','public/**/*.html'],
		clientJS: ['public/js/*.js'],// 'public/libs/**/*.js'
		clientCSS: ['public/css/*.css']
	};
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch:{
			serverViews: {
				files: watchFiles.serverViews,
				options: {
					livereload: true
				}
			},
			serverJS:{
				files:watchFiles.serverJS,
				options:{
					livereload:true
				}
			},
			clientViews: {
				files: watchFiles.clientViews,
				options: {
					livereload: true,
				}
			},
			clientJS: {
				files: watchFiles.clientJS,
				options: {
					livereload: true
				}
			},
			clientCSS: {
				files: watchFiles.clientCSS,
				options: {
					livereload: true
				}
			}
		},
		concat:{
			js:{
				src:watchFiles.clientJS,
				dest:"public/build/app.js"
			},
			css:{
				src:watchFiles.clientCSS,
				dest:"public/build/app.css"	
			}
		},
		less:{
			development:{
				options:{
					path:["public/less/"]
				},
				files:{
					'build/style.css':"public/less/*.less"
				}
			}

		},
		'node-inspector': {
		  custom: {
		    options: {
		      'web-host': 'localhost',
		      'web-port': 1337,
		      'debug-port': 5857,
		      'save-live-edit': true,
		      'preload': false,
		      'hidden': ['node_modules'],
		      'stack-trace-limit': 4,
		    }
		  }
		},
		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					nodeArgs: ['--debug'],
					ext: 'js,html',
					watch: watchFiles.clientViews.concat(watchFiles.serverJS)
				}
			}
		},
		concurrent: {
			default: ['nodemon', 'watch'],
			debug: ['nodemon', 'watch', 'node-inspector'],
			options: {
				logConcurrentOutput: true,
				limit: 10
			}
		}
	});

	// Load NPM tasks
	require('load-grunt-tasks')(grunt);

	//grunt.registerTask('default',);
	// Default task(s).
	grunt.registerTask('default',['concurrent:default']);//'less'

	// Debug task(s)
	grunt.registerTask('debug',['concat','less','concurrent:debug']);

	//Lint Task
	//Test Task
	//Build Task
	grunt.registerTask('build',['concat','less','concurrent:default']);
	//Test Task
};