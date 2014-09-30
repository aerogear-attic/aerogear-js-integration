//var exec = require('child_process').exec;
var path = require('path');
var url = require('url');
var util = require('util');
var fs = require('fs');
var crypto = require('crypto');
var Promise = require('../scripts/promisify-streams.js');
var mkdirp = Promise.denodeify(require('mkdirp'));
var request = require('request');
var _ = require('lodash');

module.exports = function ( grunt ) {

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
                                var expectedChecksum = fs.readFileSync(checksumDest);
                                grunt.log.debug( 'Expected checksum: "' + expectedChecksum + '"');
                                grunt.log.debug( 'Actual checksum:   "' + actualChecksum + '"' );
                                return actualChecksum == expectedChecksum;
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
        };

        resolveArchive()
            .then( done )
            .catch( function( err ) {
                grunt.fail.fatal( err );
            });
    });

    function download( src, dest ) {
        grunt.log.debug('Downloading ' + src + ' to ' + dest);
        return mkdirp( path.dirname(dest) )
            .then(function () {
                var req = request(src);
                req.pipe( fs.createWriteStream( dest ) );
                return Promise.promisifyStream( req );
            });
    }

    function md5sum( src ) {
        var hash = crypto.createHash('md5'),
            stream = fs.createReadStream(src);
        grunt.log.debug('Computing md5sum for ' + src );
        return Promise.promisifyStream( stream )
            .data( function( data ) {
                hash.update(data);
            })
            .then( function() {
                return hash.digest('hex');
            });
    }
};