# fs-lazy-cache

Another file system cache for Node.

Lazy-loads files into a memory cache. Caches files on write. There's an option to not write file saves to disk and only
keep in the cache. A version of scanDir is included.
 

## Installation

```
npm install fs-lazy-cache --save
```

or 

```
yarn add fs-lazy-cache
```

## Usage 

Check out the `source/test.js` file for some example usage.  

### readFile

Load a file from the filesystem and add a copy to the cache.
 
Uses `fs.readFile()` internally. 

```javascript
let fs = require('fs-lazy-cache');

fs.readFile('somefile.txt', function (err, output) {
    if (err) throw err;
    
    return output;
})
```

### readFileSync

Load a file from the filesystem and add a copy to the cache.
 
Uses `fs.readFileSync()` internally. 

```javascript
let fs = require('fs-lazy-cache');

let output = fs.readFile('somefile.txt');
```

### outputFile

Save a file to the filesystem and store a copy in the cache. 

Uses 'fs-extra.outputFile` internally. 

```javascript
fs.outputFile('somefile.txt', 'some contents', true, 5000, function (err) {
    if (err) throw err;
});    

```

`file` The filename.

`contents` The file string contents.

`toDisk` If the file should be saved to disk or only to the cache.

`timeout` (Optional) Timeout in milliseconds before deleting from the cache. 

`callback` Same callback functionality as `fs-extra.outputFile` or `fs.writeFile`

### outputFileSync

Same as above but with no callback. 

Uses 'fs-extra.outputFileSync` internally.
 
```javascript
fs.outputFileSync('somefile.txt', 'some contents', false, 2000); 
 ```

### scanDir

Scan the cache for files in a directory. Note this DOES NOT scan the filesystem.

```javascript
let filesArray = scanDir(__dirname);
```

## Credits

https://github.com/rjjakes

## License

MIT. 