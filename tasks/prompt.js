var util = require('util');

module.exports = function ( grunt ) {

    grunt.registerTask('prompt', 'Wait for user input', function() {
        var done = this.async();

        grunt.log.ok("Waiting for input...");

        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        process.stdin.on('data', function (text) {
            if (text.match(/\n/)) {
                done();
            }
        });
    });
};