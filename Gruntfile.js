/*global module:false*/
module.exports = function(grunt) {
    "use strict";

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        version: {
            activemq: '5.8.0',
            vertx: '2.1.2'
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
                downloadDir: './.tmp/downloads',
                tmpDir: './.tmp'
            },
            activemq: {
                src: 'http://archive.apache.org/dist/activemq/apache-activemq/<%= version.activemq %>/apache-activemq-<%= version.activemq %>-bin.zip',
                checksum: 'md5',
                dest: './runtimes/apache-activemq'
            },
            vertx: {
                src: 'http://dl.bintray.com/vertx/downloads/vert.x-<%= version.vertx %>.tar.gz',
                checksum: 'sha1',
                dest: './runtimes/vert.x'
            }
        },
        external_daemon: {
            activemq: {
                options: {
                    logFile: 'runtimes/apache-activemq/data/activemq.log',
                    startCheck: function(stdout, stderr) {
                        return (/Apache ActiveMQ .* started/).test(stdout);
                    },
                    stopCheck: function(stdout, stderr) {
                        return (/FINISHED/).test(stdout);
                    },
                    startCheckTimeout: 15.0
                },
                cmd: 'sh',
                args: [ 'runtimes/apache-activemq/bin/activemq', 'start' ],
                stopCmd: 'sh',
                stopArgs: [ 'runtimes/apache-activemq/bin/activemq', 'stop' ]
            },
            vertx: {
                options: {
                    startCheck: function(stdout, stderr) {
                        return (/Vertx started/).test(stdout);
                    }
                },
                cmd: './runtimes/vert.x/bin/vertx',
                args: [ 'run', './servers/vertxbustest/server.js', '-conf', 'servers/vertxbustest/conf/config.json' ]
            }
        }
    });

    // grunt-contrib tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-external-daemon');
    grunt.loadTasks('tasks');

    // Default task
    grunt.registerTask('integration-vertx', ['connect', 'jshint', 'qunit:vertx']);
    grunt.registerTask('integration-activemq', ['connect', 'jshint', 'qunit:activemq']);
    grunt.registerTask('integration-simplepush', ['connect', 'jshint', 'qunit:simplepush']);

    grunt.registerTask('ci-vertx', ['download:vertx', 'external_daemon:vertx', 'integration-vertx', 'external_daemon:vertx:stop']);
};