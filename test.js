var fsnode = require('fs');
var fs = require('./index.js');
var assert = require('assert');

// First load of file. This will come from the filesystem.
fs.readFile(__dirname + '/README.md', function (err, output) {
    if (err) throw err;

    // Does the README contain some data?
    assert(output.toString().includes('# fs-lazy-cache'));
    console.log('First readFile - PASSED');

    // Second load of file. This will come from the cache.
    fs.readFile(__dirname + '/README.md', function (err, output) {
        if (err) throw err;

        // Does the README contain some data?
        assert(output.toString().includes('# fs-lazy-cache'));
        console.log('Second readFile - PASSED');

        // First load of file. This will come from the filesystem.
        let contentsFirstSync = fs.readFileSync(__dirname + '/package.json');

        // Does the file contain some data?
        assert(contentsFirstSync.toString().includes('version'));
        console.log('First readFileSync - PASSED');

        // Second load of file. This will come from the cache.
        let contentSecondSync = fs.readFileSync(__dirname + '/package.json');

        // Does the file contain some data?
        assert(contentSecondSync.toString().includes('version'));
        console.log('Second readFileSync - PASSED');

        // Output first file.
        fs.outputFile(__dirname + '/test.txt', 'TEST', false, function (err) {
            if (err) throw err;

            console.log('First outputFile - PASSED');

            // Load the file back in. This will come from the cache.
            let contentsReload = fs.readFileSync(__dirname + '/test.txt');

            // Does it contain data?
            assert(contentsReload.toString().includes('TEST'));

            console.log('Reload passed - PASSED');

            // Remove this file before continuing.
            if (fsnode.existsSync(__dirname + '/test.txt')) {
                fsnode.unlinkSync(__dirname + '/test.txt');
            }

            // Output second file.
            fs.outputFileSync(__dirname + '/test.txt', 'TEST', false);
            console.log('First outputFileSync - PASSED');

            // Load the file back in. This will come from the cache.
            let contentsReloadSync = fs.readFileSync(__dirname + '/test.txt');

            // Does it contain data?
            assert(contentsReloadSync.toString().includes('TEST'));

            console.log('ReloadSync passed - PASSED');

            // Remove this file before finishing.
            if (fsnode.existsSync(__dirname + '/test.txt')) {
                fsnode.unlinkSync(__dirname + '/test.txt');
            }

        });

    });

});


