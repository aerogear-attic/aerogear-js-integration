//var exec = require('child_process').exec;
var path = require('path');
var url = require('url');
var util = require('util');
var fs = require('fs');
var mkdirp = require('mkdirp');
var crypto = require('crypto');
var Promise = require('promise');
var request = require('request');
var _ = require('lodash');

module.exports = function ( grunt ) {

    //grunt.registerTask( 'initLocalConfig',function(){
    //    if(!grunt.file.exists('./local-config.json')){
    //        var parentDir = path.resolve(process.cwd(), '.');
    //        var sampleContent = {
    //            home: parentDir,
    //            jbossweb: "<PATH TO YOUR JBOSS/WILDFLY DIRECTORY>/standalone/deployments/ag-push.war"
    //        }
    //        grunt.file.write('./local-config.json',JSON.stringify(sampleContent,null,'\t'));
    //        grunt.fatal('please update local-config.json with the path to your application server');
    //    }
    //    var config = grunt.config.getRaw();
    //    config.local = grunt.file.readJSON('./local-config.json');
    //
    //    verifyJBosswebDirectory(config.local.jbossweb);
    //});

    /**
     * options: {
     *   runtimeDir
     * }
     *
     * data: {
     *    src
     *    checksum
     * }
     */

    var defaultOptions = {
        runtimesDir: './runtimes'
    };

    grunt.registerMultiTask('download', 'Download build dependencies', function() {
        var done = this.async(),
            options = _.merge( {}, defaultOptions, this.options() ),
            data = this.data,
            downloadSrc = data.src,
            downloadBasename = path.basename( downloadSrc ),
            downloadType = path.extname( downloadSrc).substr(1).toLowerCase(),
            downloadDest = path.resolve( options.runtimesDir, downloadBasename),
            checksum = data.checksum,
            checksumSrc,
            checksumType,
            checksumDest;

        if (checksum) {
            if (/https?:\/\//.test(checksum)) {
                checksumType = path.extname(checksum).substr(1).toLowerCase();
                checksumSrc = checksum;
            } else if (/^(md5)$/.test(checksum)) {
                checksumType = checksum;
                checksumSrc = downloadSrc + '.' + checksum;
            } else {
                throw new Error('Unsupported checksum: ' + checksum);
            }
            checksumDest = downloadDest + '.' + checksumType
        }

        grunt.log.debug( 'Download source: ' + downloadSrc );
        grunt.log.debug( 'Download basename: ' + downloadBasename );
        grunt.log.debug( 'Download type: ' + downloadType );
        grunt.log.debug( 'Download destination: ' + downloadDest );

        var checkMd5Sum = function() {
            return Promise.resolve()
                .then( function() {
                    if (checksum) {
                        return download(checksumSrc, checksumDest)
                            .then(function() {
                                return md5sum( downloadDest );
                            })
                            .then( function( actualChecksum ) {
                                var expectedChecksum = grunt.file.read(checksumDest);
                                grunt.log.debug( 'Expected checksum: ' + expectedChecksum );
                                grunt.log.debug( 'Actual checksum: ' + actualChecksum );
                                return actualChecksum === expectedChecksum;
                            });
                    } else {
                        // we can't check checksum, so be optimistic and say the existing archive is just fine
                        return true;
                    }
                });
        };

        var resolveArchive = function() {
            return Promise.resolve( grunt.file.exists(downloadDest))
                .then( function( exists ) {
                    if ( exists ) {
                        return checkMd5Sum();
                    } else {
                        return false;
                    }
                })
                .then( function( existsAndChecksumMatches ) {
                    if ( !existsAndChecksumMatches ) {
                        return download( downloadSrc, downloadDest )
                            .then( done )
                            .catch( function( err ) {
                                grunt.log.error( err );
                            });
                    } else {
                        grunt.log.debug( 'File exists and checksum matches' );
                        return;
                    }
                });
        }

        resolveArchive()
            .then( done )
            .catch( function( err ) {
                grunt.log.error( err );
            });
    });

    function download( src, dest ) {
        return new Promise( function ( resolve, reject ) {
            grunt.log.debug( 'Downloading ' + src + ' to ' + dest );
            mkdirp( path.dirname( dest ), function( err ) {
                if ( err ) {
                    reject( err );
                } else {
                    var req = request( src );
                    req.pipe( fs.createWriteStream( dest ) );
                    req.on('end', function() {
                        resolve();
                    });
                    req.on('error', function( err ) {
                        reject( err );
                    });
                }
            });
        });
    }

    function md5sum( src ) {
        return new Promise( function( resolve, reject ) {
            grunt.log.debug('Computing md5sum for ' + src );
            try {
                var hash = crypto.createHash('md5'),
                    stream = fs.createReadStream(src);

                stream.on('data', function (data) {
                    hash.update(data);
                });

                stream.on('end', function () {
                    resolve(hash.digest('hex'));
                });

                stream.on('error', function( err ) {
                    reject( err );
                });
            } catch ( err ) {
                reject ( err );
            }
        });
    }


};