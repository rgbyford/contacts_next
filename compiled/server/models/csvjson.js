"use strict";

var dbStuff = require("./database.js");
var papa = require("papaparse");
var fs = require("fs");
var index = 0; // just to count and display the rows
var fileName = void 0;
var fd = void 0;

function CJDone(results) {
    dbStuff.importNames(index);
    console.log("import done: " + index + " rows according to papaparse");
    fs.closeSync(fd);
    fs.unlinkSync('./uploads/' + fileName);
    index = 0;
}

function CJRow(results) {
    //    document.body.style.cursor  = 'wait';
    index++;
    dbStuff.pushContact(results.data);
}

var myConfig = {
    newline: "", // auto-detect
    // eslint-disable-next-line quotes
    quoteChar: '"',
    delimiter: "", // auto-detect
    // eslint-disable-next-line quotes
    escapeChar: '"',
    header: true,
    trimHeaders: false,
    dynamicTyping: false,
    preview: 0,
    encoding: "",
    worker: false,
    comments: false,
    step: CJRow,
    complete: CJDone,
    error: undefined,
    download: false,
    skipEmptyLines: false,
    chunk: undefined,
    fastMode: undefined,
    beforeFirstChunk: undefined,
    withCredentials: undefined,
    transform: undefined
};

module.exports.csvJson = function (file) {
    console.log("csvJson file:", file);
    dbStuff.clearContacts('CSV');
    fileName = file;
    dbStuff.readCatsFile(); // read in existing categories
    // When the file is a local file we need to convert to a file Obj.
    fd = fs.openSync("./uploads/" + file);
    //    var content = fs.readFileSync("./uploads/" + file, "utf8");
    var content = fs.readFileSync(fd, "utf8");
    papa.parse(content, myConfig);
};