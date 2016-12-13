module.exports = function (grunt) {
	var pkg = grunt.file.readJSON('package.json');
	// var info = autoprefixer({ browsers: ['last 1 version'] }).info();
	// console.log(info);
	grunt.initConfig({
		pkg: pkg,
		version: '<%= pkg.version %>',
		generated: '<%= grunt.template.today() %>',
		versionLong: '<%= pkg.name %> v<%= version %> <%= pkg.author %> <%= generated %>',
		bannerCSS: '/*! <%= pkg.name %> v<%= version %> <%= generated %> */',
		bannerJSDev: [
			'凸 = 凸 || {};',
			'凸.pkg = 凸.pkg || {};',
			'凸.pkg.name        = \'<%= pkg.name %>\';',
			'凸.pkg.version     = \'<%= version %> DEV\';',
			'凸.pkg.author      = \'<%= pkg.author %>\';',
			'凸.pkg.generated   = \'<%= generated %>\';',
			'凸.pkg.versionLong = \'<%= versionLong %> DEV\';',
		].join(''),
		bannerJSProd: [
			'凸 = 凸 || {};',
			'凸.pkg = 凸.pkg || {};',
			'凸.pkg.name        = \'<%= pkg.name %>\';',
			'凸.pkg.version     = \'<%= version %> PROD\';',
			'凸.pkg.author      = \'<%= pkg.author %>\';',
			'凸.pkg.generated   = \'<%= generated %>\';',
			'凸.pkg.versionLong = \'<%= versionLong %> PROD\';',
		].join(''),
		clean: {
			build: {
				src: ['build']
			},
		},
		watch: {
			scripts: {
				files: 'source/scripts/**/*.js',
				tasks: [
					//'jshint', // Comment this line to speed up development
					'uglify:dev',
				],
				options: {
					livereload: true
				},
			},
			style: {
				files: 'source/style/**/*.s?ss',
				tasks: ['sass:dev', 'usebanner:dev'],
				options: {
					livereload: true
				},
			},
			templates: {
				files: 'source/templates/*.jade',
				tasks: ['jade:dev'],
				options: {
					livereload: true
				},
			},
		},
		jade: {
			dev: {
				files: {
					'build/development/food.html': 'source/templates/food.jade',
					'build/development/home.html': 'source/templates/home.jade',
					'build/development/berlin.html': 'source/templates/page.berlin.jade',
					'build/development/bremerhaven.html': 'source/templates/page.bremerhaven.jade',
					'build/development/hamburg.html': 'source/templates/page.hamburg.jade',
					'build/development/iceland.html': 'source/templates/page.iceland.jade',
					'build/development/krakow.html': 'source/templates/page.krakow.jade',
					'build/development/sicily.html': 'source/templates/page.sicily.jade',
					'build/development/warsaw.html': 'source/templates/page.warsaw.jade',
				},
				options: {
					client: false,
					pretty: true,
					data: {
						pkg: pkg,
					}
				},
			},
		},
		sass: {
			dev: {
				options: {
					style: 'expanded',
				},
				files: {
					'build/development/css/app.css': 'source/style/app.sass',
				},
			},
		},
		postcss: {
			prod: {
				options: {
					map: false,
					processors: [
						require('pixrem')(),
						require('autoprefixer')({ browsers: '> 1%, last 2 versions' }),
						require('css-mqpacker')({ sort: true }),
						require('cssnano')(),
					]
				},
				files: {
					'build/production/css/app.min.css': 'build/development/css/app.css',
				},
			}
		},
		connect: {
			server: {
				options: {
					port: 4000,
					base: '',
					hostname: '*'
				}
			}
		},
		uglify: {
			dev: {
				options: {
					banner: '<%= bannerJSDev %>',
					mangle: false,
					sourceMap: true,
					beautify: true,
					// mangle: false,
				},
				files: {
					'build/development/js/appCreation.js': pkg.data.appCreationModules,
					'build/development/js/app.js': pkg.data.appModules,
				}
			},
			prod: {
				options: {
					banner: '<%= bannerJSProd %>',
					mangle: true,
					sourceMap: false,
					beautify: false,
				},
				files: {
					'build/production/js/appCreation.min.js': pkg.data.appCreationModules,
					'build/production/js/app.min.js': pkg.data.appModules,
				}
			}
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				browser: true,
				globals: {
					// jQuery: true
				},
			},
			grunuses_defaults: ['source/**/*.js'],
		},
		usebanner: {
			dev: {
				options: {
					position: 'top',
					banner: '<%= bannerCSS %>',
					linebreak: true
				},
				files: {
					src: ['build/development/css/app.css']
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-banner');
	grunt.registerTask('build', 'Recreate the build directory.', ['jshint', 'clean', 'sass', 'usebanner', 'postcss', 'uglify', 'jade']);
	grunt.registerTask('server', 'Server and watch.', ['connect', 'watch']);
	grunt.registerTask('default', 'Watches the project for changes, automatically builds them and runs a server.', ['build', 'server']);
};
