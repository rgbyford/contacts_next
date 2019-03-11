"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* eslint-disable brace-style */
var MongoClient = require("mongodb").MongoClient;
var dbName = "toby";
//const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost/${dbName}`;
var dbToby = void 0;
var url = "mongodb://localhost:27017";
var routes = require("../routes/routes");
var dbFns = require('./database');
var appFns = require('../app.js');

// Connect using MongoClient
MongoClient.connect(url, function (err, client) {
    if (err) {
        throw err;
    }
    dbToby = client.db(dbName);
    dbToby.stats().then(function (res) {
        console.log("Connected to database: ", res);
    }).catch(function (err) {
        console.log("Mongo connect error: " + err);
    });
});

module.exports.clearDB = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.prev = 0;
                    _context.next = 3;
                    return dbToby.collection("contacts").drop();

                case 3:
                    console.log("Database emptied");
                    _context.next = 9;
                    break;

                case 6:
                    _context.prev = 6;
                    _context.t0 = _context["catch"](0);

                    console.log("Error emptying database");

                case 9:
                case "end":
                    return _context.stop();
            }
        }
    }, _callee, this, [[0, 6]]);
}));

module.exports.findImage = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(phone, findImageCB) {
        var found, records, cursor, item;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        found = void 0;

                        console.log("findImage 1: ", phone);
                        _context2.next = 4;
                        return dbToby.collection('images').find({
                            'Phone1-Value': phone
                        }).count();

                    case 4:
                        records = _context2.sent;

                        console.log("fI records: ", records);

                        if (!(records > 0)) {
                            _context2.next = 18;
                            break;
                        }

                        _context2.next = 9;
                        return dbToby.collection('images').find({
                            'Phone1-Value': phone
                        });

                    case 9:
                        cursor = _context2.sent;

                        console.log("after find");
                        _context2.next = 13;
                        return cursor.next();

                    case 13:
                        item = _context2.sent;

                        console.log("findImage: ", item.imageURL);
                        return _context2.abrupt("return", item.imageURL);

                    case 18:
                        return _context2.abrupt("return", '');

                    case 19:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function (_x, _x2) {
        return _ref2.apply(this, arguments);
    };
}();

module.exports.storeImage = function (phone, imageURL) {
    console.log('storeImage: ', phone, imageURL);
    var res = dbToby.collection("images").insertOne({
        'Phone1-Value': phone,
        'imageURL': imageURL
    });
};

module.exports.queryDB = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee4(asSearchAnd, asSearchOr) {
        var _this = this;

        var asFound, oSearch;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        //let iSearches = 0;
                        asFound = [];
                        oSearch = {
                            GroupMembership: {
                                $all: asSearchAnd,
                                $in: asSearchOr
                            }
                        };
                        return _context4.abrupt("return", new Promise(function () {
                            var _ref4 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3(resolve, reject) {
                                var cursor;
                                return _regenerator2.default.wrap(function _callee3$(_context3) {
                                    while (1) {
                                        switch (_context3.prev = _context3.next) {
                                            case 0:
                                                console.log("typeof asSearchOr: " + (typeof asSearchOr === "undefined" ? "undefined" : _typeof(asSearchOr)) + " length: " + asSearchOr.length + " |" + asSearchOr + "|");
                                                if (asSearchOr.length === 0) {
                                                    // generates an error
                                                    console.log("Empty OR search");
                                                    //console.log (`typeof asSearchAnd: ${typeof (asSearchAnd)} length: ${asSearchAnd.length} |${asSearchAnd}|`);
                                                    if (asSearchAnd.length === 0) {
                                                        oSearch = {};
                                                        console.log("Search any");
                                                    } else {
                                                        asSearchOr[0] = asSearchAnd[0];
                                                    }
                                                }
                                                console.log("SearchAnd: *" + asSearchAnd + "* searchOr: *" + asSearchOr + "*");
                                                console.log("oSearch: ", oSearch);
                                                //        const cursor = dbToby.collection("contacts").find({})
                                                cursor = dbToby.collection("contacts").find(oSearch)

                                                // const cursor = dbToby.collection("contacts").find({
                                                //     GroupMembership: {
                                                //         $all: asSearchAnd,
                                                //         $in: asSearchOr
                                                //     }
                                                // })
                                                .project({
                                                    GivenName: 1,
                                                    FamilyName: 1,
                                                    GroupMembership: 1,
                                                    Photo1: 1,
                                                    'Phone1-Value': 1,
                                                    imageURL: 1
                                                });
                                                //console.log ('queryDB cursor: ', cursor);

                                                cursor.each(function (err, item) {
                                                    if (err) {
                                                        console.log("Cursor error: ", err);
                                                        //throw (err);
                                                    }
                                                    if (item === null) {
                                                        console.log("Last item. " + asFound.length + " found.");
                                                        resolve(asFound);
                                                    }
                                                    //console.log(item);
                                                    asFound.push(item);
                                                });
                                                console.log("end of queryDB - found: ", asFound.length);

                                            case 7:
                                            case "end":
                                                return _context3.stop();
                                        }
                                    }
                                }, _callee3, _this);
                            }));

                            return function (_x5, _x6) {
                                return _ref4.apply(this, arguments);
                            };
                        }()));

                    case 3:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function (_x3, _x4) {
        return _ref3.apply(this, arguments);
    };
}();

//const serverFns = require('./contacts.js');
var iRowsCBCount = 0;
var dbStuff = require("./database.js");
var oContactSaved = void 0;
var aoModified = [{}];
var bLast = void 0;
var iRowsResultBad = void 0;
//let iModified = 0;;
var iRowsNBad = void 0;

module.exports.getSaved = function async() {
    return adminDb.contacts.find();
};

module.exports.getModified = function () {
    console.log("gM: ", aoModified.length);
    return aoModified;
};

// module.exports.clearModified = function () {
//     aoModified.length = 0;
//     return;
// };

module.exports.getLoaded = function () {
    return iRowsCBCount;
};

module.exports.prepLoad = function () {
    //    dbFns.clearContacts();
    iRowsCBCount = 0;
    //iModified = 0;
    aoModified.length = 0;
};

function insertContactCallback(err, res) {
    //console.log("iCCB: ", rowCBCount);
    if (err) {
        console.log("iC err: ", err.name, err.message);
        console.log("iC err - not loaded", aoModified.length);
        //console.log ("result: ", err);
    } else {
        if (res.result.nModified > 0) {
            console.log("nM > 0: " + iRowsCBCount + ": " + res.result.n + " " + res.result.nModified + " " + res.result.ok);
            console.log(oContactSaved.GivenName + " " + oContactSaved.FamilyName);
            //            aoModified.push(oContactSaved);
            var oMod = {};
            oMod.GivenName = oContactSaved.GivenName;
            oMod.FamilyName = oContactSaved.FamilyName;
            aoModified.push(oMod);
            //iModified++;
        }
        if (res.result.n !== 1) {
            console.log("nR != 1: " + iRowsCBCount + ": " + res.result.n + " " + res.result.nModified + " " + res.result.ok);
            //console.log("rowCBCount: ", rowCBCount);
            //    console.log("Rows: ", rowCount);
            iRowsNBad++;
        }
        if (res.result.ok !== 1) {
            console.log("ok != 1: " + iRowsCBCount + ": " + res.result.n + " " + res.result.nModified + " " + res.result.ok);
            //console.log("rowCBCount: ", rowCBCount);
            //    console.log("Rows: ", rowCount);
            iRowsResultBad++;
        }
        iRowsCBCount++;
        dbStuff.importNames(); // recursive call for next row
        //console.log("iC result: ", ++iCC, res.result);
    }
    //if (!bRenderedContacts && (iRowsCBCount >= iSavedCount - 2)) {
    if (bLast) {
        console.log("last callback");
        console.log("Modified: ", aoModified.length);
        console.log("RowsNBad", iRowsNBad);
        console.log("iRowsResultBad", iRowsResultBad);
        dbStuff.writeFile(); // categories
        aoModified.shift(); // remove first (empty) element
        appFns.sendSomething(aoModified);
        //        bRenderedContacts = true;
        bLast = false;
    }
    //    console.log ("Rows: ", iSavedCount, iRowsCBCount);
    return;
}

module.exports.insertContact = function (oContact, bLastParam) {
    bLast = bLastParam;
    oContactSaved = oContact;
    var res = dbToby.collection("contacts").updateOne({
        "E-mail1-Value": oContact["E-mail1-Value"],
        "GivenName": oContact["GivenName"],
        "FamilyName": oContact["FamilyName"]
    }, {
        $set: oContact
    }, {
        upsert: true
    }, insertContactCallback);
};