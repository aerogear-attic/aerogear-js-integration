var fs;

fs = require('fs');

module.exports = function (grunt) {
    'use strict';

    grunt.registerTask("force", "Conditionally run tasks if destination files are missing", function (taskName, targetName) {
        grunt.option('force', true);
        grunt.task.run([
            [].slice.call(arguments).join(':')
        ]);
    });
};