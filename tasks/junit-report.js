var util = require('util');
var fs = require('fs');
var Promise = require('../scripts/promisify-streams.js');
var xmlToJson = Promise.denodeify( require('xml2js').parseString );
var colors = require('colors/safe');

module.exports = function ( grunt ) {

    // collect results stored in xml reports and prints aggregated result to console;
    // in case of failure, it fails the execution
    grunt.registerTask('ci-report', function () {
        var done = this.async();
        var parseResults = [];

        grunt.file.recurse('./results', function (abspath, rootdir, subdir, filename) {
            var junitXml = fs.readFileSync( abspath );
            parseResults.push( xmlToJson( junitXml ) );
        });

        Promise.all(parseResults)
            .then(function (results) {
                var tests = 0;
                var failures = 0;
                var errors = 0;

                results.forEach( function( result ) {
                    result.testsuites.testsuite.forEach( function( testsuite ) {
                        tests += parseInt( testsuite.$.tests );
                        failures += parseInt( testsuite.$.failures );
                        errors += parseInt( testsuite.$.errors );
                    });
                });

                if ( !failures && !errors ) {
                    console.log();
                    console.log( colors.green('    ✓ ALL ' + tests + ' TESTS PASSED'));
                    console.log();
                } else {
                    console.log();
                    console.log( colors.red(util.format('    ✗ TESTS FAILED' )));
                    console.log();
                    console.log( '        Tests: ', tests );
                    console.log( '        Failures: ', failures );
                    console.log( '        Errors: ', errors );
                    console.log();
                    grunt.fail.warn(' there are test failures');
                }
            })
            .then( done );
    });
};