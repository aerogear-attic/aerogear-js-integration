/*global module:false*/
module.exports = function(grunt) {
    "use strict";

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

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
            },
            jbossas: {
                files: [],
                options: {
                    urls: [
                        "http://localhost:<%= connect.server.options.port %>/tests/pipeline/cors-jsonp/rest-tests.html",
                        "http://localhost:<%= connect.server.options.port %>/tests/pipeline/cors-jsonp/secure-rest-tests.html"
                    ],
                    "--web-security": false,
                    "--ssl-protocol": "tlsv1",
                    "--ignore-ssl-errors": "yes"
                }
            }
        },
        servers: {
            jboss: {
                download: {
                    url: 'http://download.jboss.org/jbossas/7.1/jboss-as-7.1.1.Final/jboss-as-7.1.1.Final.zip',
                    targetDir: 'servers/jboss-as/target'
                },
                extract : {
                    targetDir: 'servers/jboss-as/target'
                },
                startup: {
                    options: {
                        httpPort: 8080,
                        httpsPort: 8443,
                        xms: '256m',
                        xmx: '512m',
                        maxPermSize: '256m',
                        bindingAddress: '127.0.0.1',
                        keystoreAlias: 'aerogear',
                        keystorePassword: 'aerogear',
                        keystoreFile: 'servers/jboss-as/aerogear-js-itests-rest-service/cert/aerogear.keystore',
                        securityProtocol: 'TLSv1',
                        baseProcessId: 'jboss-as'
                    }
                },
                deploy: {
                    archive: 'servers/jboss-as/aerogear-js-itests-rest-service/target/aerogear-rest-service.war'
                }
            }
        },
        maven: {
            build: {
                pom: 'servers/jboss-as/aerogear-js-itests-rest-service/pom.xml'
            }
        },
        jshint: {
            all: {
                src: [ "Gruntfile.js", "src/**/*.js" ],
                options: {
                    jshintrc: ".jshintrc"
                }
            }
        }
    });

    // grunt-contrib tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-jboss-as');

    // Default task
    grunt.registerTask('integration-vertx', ['connect', 'jshint', 'qunit:vertx']);
    grunt.registerTask('integration-activemq', ['connect', 'jshint', 'qunit:activemq']);
    grunt.registerTask('integration-simplepush', ['connect', 'jshint', 'qunit:simplepush']);
    grunt.registerTask('integration-jbossas', ['download-jboss-as', 'extract-jboss-as', 'start-jboss-as-default', 'maven-build-default', 'deploy-archive-jboss-as-default', 'connect', 'jshint', 'qunit:jbossas', 'stop-all-processes']);
};
