let path = require('path');
let cache = require('memory-cache');
let fs = require('fs-extra');
let startsWith = require('lodash.startswith');

/**
 * @param file
 * @param callback
 * @returns {*}
 */
const readFile = function (file, callback) {
    // Attempt to load the file from the cache.
    let cachedContents;
    if (cachedContents = cache.get(file)) {
        return callback(false, cachedContents);
    }

    // Not found so do a normal filesystem read.
    fs.readFile(file, function (err, contents) {

        // Put the file in the cache.
        if (!err) {
            cache.put(file, contents);
        }

        // And return the buffer.
        return callback(err, contents);
    });
};

/**
 * @param file
 * @returns {*}
 */
const readFileSync = function (file) {
    // Attempt to load the file from the cache.
    let cachedContents;
    if (cachedContents = cache.get(file)) {
        return cachedContents;
    }

    // Not found so do a normal filesystem read.
    let contents = fs.readFileSync(file);

    if (contents) {
        // Put the file in the cache.
        cache.put(file, contents);

        // And return the buffer.
        return contents;
    }
    else {
        throw Error('Failed to load');
    }
};

/**
 * @param file       - filename
 * @param contents   - string contents
 * @param toDisk     - if false, the file will only be stored in the cache.
 * @param timeout    - is passed, the cache entry will be deleted after x milliseconds.
 * @param callback
 * @returns {*}
 */
const outputFile = function (file, contents, toDisk, timeout, callback) {

    // timeout is optional.
    if (typeof timeout === 'function') {
        callback = timeout;
        timeout = null;
    }

    // Don't save to disk.
    if (!toDisk) {
        // Set the cache regardless.
        if (timeout) {
            cache.put(file, contents, timeout);
        }
        else {
            cache.put(file, contents);
        }

        // Return with no errors.
        return callback(null);
    }
    // Save to disk.
    else {
        fs.outputFile(file, contents, function (err) {
            // Put the file in the cache.
            if (!err) {
                if (timeout) {
                    cache.put(file, contents, timeout);
                }
                else {
                    cache.put(file, contents);
                }
            }

            // And return the buffer.
            return callback(err);
        });
    }
};

/**
 * @param file       - filename
 * @param contents   - string contents
 * @param toDisk     - if false, the file will only be stored in the cache.
 * @param timeout    - is passed, the cache entry will be deleted after x milliseconds.
 * @returns {boolean}
 */
const outputFileSync = function (file, contents, toDisk, timeout) {

    // Don't save to disk.
    if (!toDisk) {
        // Set the cache regardless.
        if (timeout) {
            cache.put(file, contents, timeout);
        }
        else {
            cache.put(file, contents);
        }

        // Return with no errors.
        return true;
    }
    // Save to disk.
    else {
        if (fs.outputFileSync(file, contents)) {
            // Set the cache.
            if (timeout) {
                cache.put(file, contents, timeout);
            }
            else {
                cache.put(file, contents);
            }

            return true;
        }
        else {
            throw Error('Failed to output.');
        }
    }
};

/**
 * Scan the cache for files. (Doesn't scan the filesystem).
 * @param directory
 * @returns {Array}
 */
const scanDir = function (directory) {

    // Patch the directory, adding a trailing slash.
    if (directory.substr(-1) !== '/') {
        directory += '/';
    }

    // Set up the list to be returned.
    let list = [];

    // Loop through entries in the cache.
    cache.keys().forEach(function (filename) {
        // If found, add it to the list.
        if (startsWith(filename, directory) && !filename.split(directory).pop().includes('/')) {
            list.push(filename);
        }
    });

    return list;
};

// Expose the functions.
module.exports = {
    readFile: readFile,
    readFileSync: readFileSync,
    outputFile: outputFile,
    outputFileSync: outputFileSync,
    scanDir: scanDir
};
