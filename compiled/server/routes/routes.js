"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require("express");
var router = express.Router();
var cjFns = require("../models/csvjson.js");
var vcfFns = require('../models/vcfjson.js');
var dbFunctions = require("../models/database.js");
var dbConn = require("../models/connection.js");
var socketIo = require("socket.io");

var aoCats = [{}];
var asPrev = [];
var iAnds = -1;
var bAndBtnDisabled = false;
var bClearedDB = false;
var multer = require("multer");
var uploadMulter = multer({
    dest: "./uploads/"
});

// I don"t know if the "avatar" here has to match what is in the put
router.put("/contacts/import", uploadMulter.single("avatar"), function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res, next) {
        var fname;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        //req.file.filename gives the file name on the server
                        // req.file.originalname gives the client file name
                        // console.log("body: ", req.body);
                        //    document.body.style.cursor  = 'wait';
                        // console.log ("res render import");
                        // res.render("loadcontacts", {
                        //     loading: true
                        // });
                        // open a socket
                        //const io = socketIo();

                        bClearedDB = false;
                        //console.log("/contacts/import req body: ", req.body);

                        if (!(req.body.clearDB === 'true')) {
                            _context.next = 5;
                            break;
                        }

                        _context.next = 4;
                        return dbConn.clearDB();

                    case 4:
                        bClearedDB = true;
                        // empty the database collection

                    case 5:
                        if (req.body.clearCats === 'true') {
                            dbFunctions.deleteCatsFile();
                            // erase the categories file
                        }
                        fname = req.file.filename.toLowerCase();

                        console.log("file name: ", fname);
                        if (req.body.csv === 'true') {
                            cjFns.csvJson(fname);
                        } else {
                            vcfFns.vcfJson(fname);
                        }

                    case 9:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
}());

router.get('/categories', function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        console.log("server get cats");
                        try {
                            aoCats = dbFunctions.readCatsFile();
                            res.json({
                                aoCats: aoCats
                            }); // and sends it
                        } catch (err) {
                            console.log("categories fetch error");
                            res.json({
                                error: err.message || err.toString()
                            });
                        }

                    case 2:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function (_x4, _x5) {
        return _ref2.apply(this, arguments);
    };
}());

router.post("/contacts", function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
        var asSearchAnd, asSearchOr, i, sFind, asFinds, _i, _i2;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        console.log("post contacts");
                        //    setPrevious();
                        //    iAnds = -1;
                        asSearchAnd = [];
                        asSearchOr = [];

                        //console.log("search body: ", req.body);

                        for (i = 0; i < req.body.search.length; i++) {
                            sFind = req.body.search[i];

                            console.log("sFind: ", sFind);
                            //    console.log ("sFind[0]: ", sFind[0]);

                            //    asPrev.forEach((sFind, index) => {
                            //console.log("sFind: ", sFind);
                            sFind = sFind.trim();
                            //console.log(`sFind trimmed: *${sFind}*`);
                            asFinds = sFind.split("&");
                            //console.log(`asFinds: ${asFinds}`);
                            //console.log(`asFinds.length ${asFinds.length}`);

                            if (asFinds.length > 1) {
                                //['x y']
                                asFinds.forEach(function (sCat, j) {
                                    var asFindBars = sCat.split("|");
                                    if (asFindBars.length > 1) {
                                        // there's an OR
                                        asFindBars.forEach(function (sCatOr) {
                                            asSearchOr.push(sCatOr);
                                        });
                                    } else {
                                        if (sCat !== "any") {
                                            //console.log(`pushing and 1: ${sCaT}`);
                                            asSearchAnd.push(sCat);
                                        }
                                    }
                                });
                            } else {
                                // no &
                                if (asFinds[0].length) {
                                    //console.log(`pushing and 2: |${asFinds[0]}|`);
                                    asSearchAnd.push(asFinds[0]);
                                }
                            }
                        }
                        for (_i = 0; _i < asSearchAnd.length; _i++) {
                            asSearchAnd[_i] = asSearchAnd[_i].replace(/\s/g, '');
                            console.log("asSA spaces removed: |" + asSearchAnd[_i] + "|");
                        }
                        for (_i2 = 0; _i2 < asSearchOr.length; _i2++) {
                            asSearchOr[_i2] = asSearchOr[_i2].replace(/\s/g, '');
                            console.log("asSO spaces removed: |" + asSearchOr[_i2] + "|");
                        }
                        // replace , with OR 
                        //        asPrev[index] = asPrev[index].replace(/\|/g, " | ");
                        //        asPrev[index] = asPrev[index].replace(/,/g, " OR ");
                        //    });
                        // try splitting each sub-array by ','
                        // search is <first element> AND <second element>
                        // if split returns > 1, build an OR (pp AND (a OR c))
                        // if split returns 1, just treat it "as is" (1 AND ace)
                        // if "any" as the last sub-array, ignore it
                        // so search string is "{$and [{$eq: array0}" + if there's an or ", $or[{$eq: subarray0}, {$eq: subarray1}, ...]]}"
                        // otherwise ", {$eq: array1}, {$eq: array2}]}"
                        // if last asPrev, add "} to search string.  Else add ", "
                        // end for each asPrev.  Go around, 

                        //console.log("/contacts/search: ", asSearchAnd, asSearchOr);
                        dbConn.queryDB(asSearchAnd, asSearchOr).then(function (aoFound) {
                            // mongo returns an extra null element on the end of the array
                            // don't ask why howMany is done in such a weird way
                            // handlebars wasn't coping with an extra variable
                            if (aoFound.length === undefined || aoFound.length <= 1) {
                                // none found
                                aoFound.length = 0;
                                aoFound.push({
                                    GivenName: "None",
                                    FamilyName: "found"
                                });
                                //    aoFound.length = 1;
                                // aoFound[0].GivenName = "None";
                                // aoFound[0].FamilyName = "found";
                                aoFound[0].howMany = 0; // don't count this one!
                            } else {
                                aoFound.length = aoFound.length - 1;
                                aoFound[0].howMany = aoFound.length;
                            }
                            console.log("aoF length: ", aoFound.length);
                            //console.log ("aoFound: ", aoFound);
                            for (var _i3 = 0; _i3 < aoFound.length; _i3++) {
                                aoFound[_i3].itemNum = _i3;
                            }
                            // aoFoundPeople = aoFound;
                            //        console.log("/contacts/search: ", aoFoundPeople);
                            // askFC(aoFound[0]['Phone1-Value']).then(function (picture) {
                            // res.render("index", {
                            //     search: true,
                            //     asPrevSearch: asPrev,
                            //     aoFound: aoFound,
                            //     showImage: false
                            // });
                            // });
                            res.json({
                                aoFound: aoFound
                            }); // and sends it
                        });

                        return _context3.abrupt("return");

                    case 8:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function (_x6, _x7) {
        return _ref3.apply(this, arguments);
    };
}());

module.exports = router;