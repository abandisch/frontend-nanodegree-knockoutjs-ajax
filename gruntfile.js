module.exports = function(grunt) {
    grunt.initConfig({

        uglify: {
            main: {
                files: {
                    'dist/js/app.min.js' : ['src/js/jquery.min.js',
                                            'src/js/underscore-min.js',
                                            'src/js/bootstrap.min.js',
                                            'src/js/knockout-3.3.0.js',
                                            'src/js/myKoView.js',
                                            'src/js/myapp.js']
                }
            }
        }, // uglify

        cssmin: {
            main: {
                options: {
                    shorthandCompacting: false,
                    roundingPrecision: -1
                },
                files: {
                    'dist/css/styles.min.css': ['src/css/bootstrap.min.css', 'src/css/style.css']
                }
            }
        }, // cssmin

        htmlmin: {
            main: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'src/index.html'
                }
            }
        }, // htmlmin

        watch: {
            options: {
                spawn: true
            },
            mainJS: {
                files: ['src/js/*.js'],
                tasks: ['processMainJS']
            },
            mainCSS: {
                files: ['src/css/*.css'],
                tasks: ['processMainCSS']
            },
            mainHTML: {
                files: ['src/*.html'],
                tasks: ['processMainHTML']
            }

        } // watch


    }); // InitConfig

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Tasks
    grunt.registerTask('default', ['uglify', 'cssmin', 'htmlmin', 'watch']);
    grunt.registerTask('processMainHTML', ['htmlmin:main']);
    grunt.registerTask('processMainJS', ['uglify:main']);
    grunt.registerTask('processMainCSS', ['cssmin:main']);

}; // Wrapper function
