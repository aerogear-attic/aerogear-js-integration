/*global module:false*/
module.exports = function(grunt) {
    "use strict";

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        version: {
            activemq: '5.8.0',
            vertx: '2.1.2',
            simplepushserver: '0.13.0-SNAPSHOT'
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
                dest: './runtimes/activemq',
                overlay: './servers/activemqtest/conf.tar.gz'
            },
            vertx: {
                src: 'http://dl.bintray.com/vertx/downloads/vert.x-<%= version.vertx %>.tar.gz',
                checksum: 'sha1',
                dest: './runtimes/vert.x'
            },
            simplepush: {
                src: 'https://github.com/lfryc/aerogear-simplepush-server/releases/download/<%= version.simplepushserver %>/aerogear-simplepush-server-standalone-<%= version.simplepushserver %>.jar',
                dest: './runtimes/aerogear-simplepush-server-standalone.jar'
            }
        },
        daemon: {
            activemq: {
                options: {
                    logFile: 'runtimes/activemq/data/activemq.log',
                    startCheck: function(stdout, stderr) {
                        return (/Apache ActiveMQ .* started/).test(stdout);
                    },
                    stopCheck: function(stdout, stderr) {
                        return (/FINISHED/).test(stdout);
                    },
                    startCheckTimeout: 15.0
                },
                cmd: 'sh',
                args: [ 'runtimes/activemq/bin/activemq', 'start' ],
                stopCmd: 'sh',
                stopArgs: [ 'runtimes/activemq/bin/activemq', 'stop' ]
            },
            vertx: {
                options: {
                    startCheck: function(stdout, stderr) {
                        return (/Vertx started/).test(stdout);
                    }
                },
                cmd: './runtimes/vert.x/bin/vertx',
                args: [ 'run', './servers/vertxbustest/server.js', '-conf', 'servers/vertxbustest/conf/config.json' ]
            },
            simplepush: {
                options: {
                    startCheck: function(stdout, stderr) {
                        return (/Server started/).test(stderr);
                    }
                },
                cmd: 'java',
                args: [ '-jar', './runtimes/aerogear-simplepush-server-standalone.jar' ]
            }
        },
        karma: {
            options: {
                frameworks: ['qunit'],
                browsers: ['PhantomJS'],
                reporters: ['spec'],
                singleRun: true,
                logLevel: 'WARN'
            },
            vertx: {
                options: {
                    files: [
                        'jquery-1.10.2.min.js',
                        'tests/notifier/stomp.js',
                        'tests/notifier/sockjs-0.3.4.js',
                        'tests/notifier/vertxbus.js',
                        'aerogear.js',
                        'tests/notifier/vertx.js'
                    ]
                }
            },
            activemq: {
                options: {
                    files: [
                        'jquery-1.10.2.min.js',
                        'tests/notifier/stomp.js',
                        'tests/notifier/sockjs-0.3.4.js',
                        'tests/notifier/vertxbus.js',
                        'aerogear.js',
                        'tests/notifier/stompws.js'
                    ]
                }
            },
            simplepush: {
                options: {
                    files: [
                        'jquery-1.10.2.min.js',
                        'tests/simplepush/sockjs-0.3.4.js',
                        'aerogear.js',
                        'tests/simplepush/simplepush.js'
                    ]
                }
            }
        }
    });

    // grunt-contrib tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-external-daemon');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadTasks('tasks');
    grunt.renameTask('external_daemon', 'daemon');

    // Default task
    grunt.registerTask('integration-vertx', ['jshint', 'karma:vertx']);
    grunt.registerTask('integration-activemq', ['jshint', 'karma:activemq']);
    grunt.registerTask('integration-simplepush', ['jshint', 'karma:simplepush']);

    grunt.registerTask('ci-vertx', ['download:vertx', 'daemon:vertx', 'integration-vertx', 'daemon:vertx:stop']);
    grunt.registerTask('ci-activemq', ['download:activemq', 'daemon:activemq', 'integration-activemq', 'daemon:activemq:stop']);
    grunt.registerTask('ci-simplepush', ['download:simplepush', 'daemon:simplepush', 'integration-simplepush', 'daemon:simplepush:stop']);

    grunt.registerTask('travis', [ 'ci-vertx', 'ci-activemq', 'ci-simplepush' ]);
};