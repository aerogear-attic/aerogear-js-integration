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

        jshint: {
            all: {
                src: [ "Gruntfile.js", "src/**/*.js", "tasks/**/*.js", "scripts/**/*.js" ],
                options: {
                    jshintrc: ".jshintrc"
                }
            }
        },
        clean: {
            vertx: ['results/vertx-results.xml'],
            activemq: ['results/activemq-results.xml'],
            simplepush: ['results/simplepush-results.xml']
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
            options: {
                startCheckTimeout: 15.0
            },
            activemq: {
                options: {
                    logFile: 'runtimes/activemq/data/activemq.log',
                    startCheck: function(stdout, stderr) {
                        return (/Apache ActiveMQ .* started/).test(stdout);
                    },
                    stopCheck: function(stdout, stderr) {
                        return (/FINISHED/).test(stdout);
                    }
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
            },
            simplepushRelay: {
                options: {
                    startCheck: function(stdout, stderr) {
                        return (/Push Relay Server Listening on port 8888/).test(stdout);
                    }
                },
                cmd: 'node',
                args: [ './servers/simplepush/pushRelayServer.js' ]
            }
        },
        karma: {
            options: {
                frameworks: ['qunit'],
                browsers: ['PhantomJS_noSecurity'],
                reporters: ['spec', 'junit'],
                singleRun: true,
                logLevel: 'WARN',
                junitReporter: {
                    outputFile: 'test-results.xml'
                },
                customLaunchers: {
                    'PhantomJS_noSecurity': {
                        base: 'PhantomJS',
                        options: {
                            settings: {
                                webSecurityEnabled: false
                            }
                        }
                    }
                }
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
                    ],
                    junitReporter: {
                        outputFile: 'results/vertx-results.xml'
                    }
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
                    ],
                    junitReporter: {
                        outputFile: 'results/activemq-results.xml'
                    }
                }
            },
            simplepush: {
                options: {
                    files: [
                        'jquery-1.10.2.min.js',
                        'tests/simplepush/sockjs-0.3.4.js',
                        'aerogear.js',
                        'tests/simplepush/simplepush.js'
                    ],
                    junitReporter: {
                        outputFile: 'results/simplepush-results.xml'
                    }
                }
            }
        }
    });

    // grunt-contrib tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-external-daemon');
    grunt.renameTask('external_daemon', 'daemon');
    grunt.loadTasks('tasks');

    // Default task
    grunt.registerTask('test-vertx', ['karma:vertx']);
    grunt.registerTask('test-activemq', ['karma:activemq']);
    grunt.registerTask('test-simplepush', ['karma:simplepush']);

    grunt.registerTask('ci-vertx', ['download:vertx', 'clean:vertx', 'daemon:vertx', 'test-vertx', 'daemon:vertx:stop']);
    grunt.registerTask('ci-activemq', ['download:activemq', 'clean:activemq', 'daemon:activemq', 'test-activemq', 'daemon:activemq:stop']);
    grunt.registerTask('ci-simplepush', ['download:simplepush', 'clean:simplepush', 'daemon:simplepush', 'daemon:simplepushRelay', 'test-simplepush', 'daemon:simplepushRelay:stop', 'daemon:simplepush:stop']);

    grunt.registerTask('ci-all', [
        'clean',
        'jshint',
        'force:ci-vertx',
        'force:ci-activemq',
        'force:ci-simplepush',
        'ci-report'
    ]);
};