var Promise = require('promise');

Promise.promisifyStream = function( stream ) {
    var fnData;
    var promise = new Promise( function ( resolve, reject ) {
        stream.on( 'error', function( err ) {
            reject( err );
        });
        stream.on( 'end', function() {
            resolve();
        });
        stream.on( 'data', function( data ) {
            if ( fnData ) {
                fnData( data );
            }
        });
    });
    promise.data = function( callback ) {
        fnData = callback;
        return promise;
    };
    return promise;
};

module.exports = Promise;