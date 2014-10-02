/*global module:false*/
module.exports = function(grunt) {
    "use strict";

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        version: {
            activemq: '5.8.0'
        },

        connect: {
            server: {
                options: {
                    port: 8000,
                    hostname: 'localhost'
                }
            }
        },
        qunit: {
            vertx: {
                files: [],
                options: {
                    urls: [
                        'http://localhost:<%= connect.server.options.port %>/tests/notifier/vertx.html'
                    ],
                    "--web-security": false
                }
            },
            activemq: {
                files: [],
                options: {
                    urls: [
                        'http://localhost:<%= connect.server.options.port %>/tests/notifier/stompws.html'
                    ],
                    "--web-security": false
                }
            },
            simplepush: {
                files: [],
                options: {
                    urls: [
                        'http://localhost:<%= connect.server.options.port %>/tests/simplepush/simplepush.html'
                    ],
                    "--web-security": false
                }
            }
        },
        jshint: {
            all: {
                src: [ "Gruntfile.js", "src/**/*.js" ],
                options: {
                    jshintrc: ".jshintrc"
                }
            }
        },
        download: {
            options: {
                downloadDir: './runtimes',
                tmpDir: './.tmp'
            },
            activemq: {
                src: 'http://archive.apache.org/dist/activemq/apache-activemq/<%= version.activemq %>/apache-activemq-<%= version.activemq %>-bin.zip',
                checksum: 'md5',
                dest: './runtimes/apache-activemq'
            }
        }
    });

    // grunt-contrib tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadTasks('tasks');

    // Default task
    grunt.registerTask('integration-vertx', ['connect', 'jshint', 'qunit:vertx']);
    grunt.registerTask('integration-activemq', ['connect', 'jshint', 'qunit:activemq']);
    grunt.registerTask('integration-simplepush', ['connect', 'jshint', 'qunit:simplepush']);
};