'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var connFns = require("./connection.js");

var iBadOnes = 0;

var aasTagsMain = [['1', '1'], ['event', 'event'], ['los', 'los'], ['mashable', 'mashable'], ['PP', 'PP'], ['seven-horizons', 'seven-horizons'], ['via-ace', 'via-ace'], ['x', 'x'], ['pp', 'Prodigium'], ['coc', 'Cinema of Change'], ['dis', 'dis'], ['ethn', 'ethnicity'], ['gend', 'gender'], ['intellectual', 'intellectual'], ['id', 'ideology'], ['lang', 'language spoken'], ['loc', 'location'], ['net', 'shared network'], ['team', 'Prodigium worker'], ['research', 'researcher'], ['sport', 'sports pro'], ['queer', 'neither']];

var aoTagNames = [];

for (var i = 0; i < aasTagsMain.length; i++) {
    aoTagNames.push({
        'sShortName': aasTagsMain[i][0],
        'sLongName': aasTagsMain[i][1]
    });
}
//console.log(aoTagNames[0]);

var AoCats = function AoCats(sCat, asSubCat) {
    _classCallCheck(this, AoCats);

    this.sIsSubCatOf = sCat;
    this.sThisCat = asSubCat;
};

var aoCatsRead = [];

var fs = require("fs");
var fdCats = void 0;

function indexOfByKey(obj_list, key, value) {
    for (var index in obj_list) {
        // console.log("iOBK: ", index, obj_list[index][key], value);
        if (obj_list[index][key] === value) return index;
    }
    return -1;
}

module.exports.writeDateFile = function () {
    var fdDate = fs.openSync('loaddate.txt', 'w');
    var sDate = new Date();
    console.log('sDate1: ', sDate);
    sDate = sDate.toString().slice(4, 15);
    console.log("sDate2:", sDate);
    fs.writeFileSync(fdDate, sDate);
    fs.closeSync(fdDate);
};

module.exports.readDateFile = function () {
    var fdDate = fs.openSync('loaddate.txt', 'r');
    var sDate = fs.readFileSync(fdDate, "utf8");
    fs.closeSync(fdDate);
    return sDate;
};
// functions for dealing with the categories

function openCatsFile(mode) {
    // if (mode === 'r') {
    // fs.accessSync('categories.txt', fs.constants.F_OK, (err) => {
    //     console.log(`categories.txt ${err ? 'does not exist' : 'exists'}`);
    //     if (err) {
    //         mode = 'w';     // open it for write (makes new one)
    //     }
    //   });
    // }
    fdCats = fs.openSync("categories.txt", mode);
}

function writeCatsFile(aoCats) {
    openCatsFile("w");
    fs.writeFileSync(fdCats, JSON.stringify(aoCats));
    fs.closeSync(fdCats);
}

module.exports.deleteCatsFile = function () {
    fs.unlinkSync('categories.txt', function (err) {
        if (err) throw err;
        console.log('categories file deleted');
    });
};

module.exports.writeFile = function () {
    console.log("wCF: ", aoCatsRead.length);
    console.log("Bad tags: ", iBadOnes);
    writeCatsFile(aoCatsRead);
    iBadOnes = 0;
};

module.exports.readCatsFile = function () {
    openCatsFile("a+");
    var sCats = fs.readFileSync(fdCats, "utf8");
    if (sCats.length) {
        aoCatsRead = JSON.parse(sCats);
    } else {
        aoCatsRead = [];
    }
    fs.closeSync(fdCats);
    return aoCatsRead;
};

module.exports.findSubCats = function (sCat) {
    var asSubCats = [];
    for (var _i = 0; _i < aoCatsRead.length; _i++) {
        if (aoCatsRead[_i].isSubCatOf === sCat) {
            asSubCats.push(acCatsRead.sThisCat);
        }
    }
};

var contactsSource = void 0;

module.exports.clearContacts = function (source) {
    contactsSource = source;
    aoContacts.length = 0;
    connFns.prepLoad();
};

module.exports.pushContact = function (oContact) {
    aoContacts.push(oContact);
};

var arrayUnique = function arrayUnique(arr) {
    return arr.filter(function (item, index) {
        return arr.indexOf(item) >= index;
    });
};

function buildCategories(asTag) {
    var _loop = function _loop(_i2) {
        // first, clean up the string
        // ignore anything that doesn't begin with .
        if (asTag[_i2][0] !== ".") {
            //console.log ("continue");
            iBadOnes++;
            return 'continue';
        }
        asTag[_i2] = asTag[_i2].slice(1); // remove the .
        // replace .. with _
        asTag[_i2] = asTag[_i2].replace("..", "_");
        // replace vendors with vendor
        asTag[_i2] = asTag[_i2].replace("vendors", "vendor");
        // replace . with _
        asTag[_i2] = asTag[_i2].replace(/\./g, "_");

        // tag is now "_cat_subcat_subcat_subcat...
        var asCatSub = asTag[_i2].split("_"); // Cat in the first element of the array, Subs in the others

        // replace short category names with long
        var iTagPos = indexOfByKey(aoTagNames, 'sShortName', asCatSub[0]);
        // console.log ("iTP: ", iTagPos);
        if (iTagPos >= 0) {
            asCatSub[0] = aoTagNames[iTagPos].sLongName;
            //console.log ("sTS: ", req.body.sValue[0], sSearch);            
        }

        var sIsSubCatOf = "";

        var _loop2 = function _loop2(j) {
            // go through the cats & subCats
            var iCatFound = void 0;
            //            if (aoCatsRead.length === 0) {
            //                iCatFound = -1;
            //            } else {
            //                console.log ("calling findIndex");
            iCatFound = aoCatsRead.findIndex(function (element) {
                return element.sThisCat === asCatSub[j];
            });
            //            }
            //            console.log ("iCatFound: ", iCatFound);
            if (iCatFound < 0) {
                // category doesn't exist - add it
                //console.log("Found a new one", asCatSub[j]);
                aoCatsRead.push(new AoCats(sIsSubCatOf, asCatSub[j]));
            }
            sIsSubCatOf = asCatSub[j];
        };

        for (var j = 0; j < asCatSub.length; j++) {
            _loop2(j);
        }
    };

    for (var _i2 = 0; _i2 < asTag.length; _i2++) {
        var _ret = _loop(_i2);

        if (_ret === 'continue') continue;
    }
}

var iRows = 0;
var aoContacts = [];
var iSavedCount = void 0;

module.exports.importNames = function () {
    var iCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    //console.log ('aoClength: ', aoContacts.length);
    if (iCount) {
        iSavedCount = iCount;
    }
    if (aoContacts.length === 0) {
        // done
        console.log('Import names done - ' + iRows + ' rows');
        //        document.body.style.cursor  = 'default';
        return;
    }
    var oContact = {};
    var nestedContent = aoContacts[0];
    //console.log ('nnn', nestedContent);
    Object.keys(nestedContent).forEach(function (docTitle) {
        var givenName = void 0;
        var sPropName = docTitle.replace(/ /g, "");
        if (docTitle === "Given Name") {
            givenName = nestedContent[docTitle];
            oContact.GivenName = givenName;
        } else if (docTitle === "Family Name") {
            oContact.FamilyName = nestedContent[docTitle];
        } else if (docTitle === "Group Membership") {
            var asFirstSplit = [];
            var asSecondSplit = [];
            var sValue = nestedContent[docTitle];
            // VCF file splits tags with ',' - CSV file with ':::'
            asFirstSplit = sValue.split(contactsSource === 'CSV' ? ' ::: ' : ',');
            for (var _i3 = 0; _i3 < asFirstSplit.length; _i3++) {
                var sTemp = void 0;
                //if (asFirstSplit[i][0] === ".") {
                //    asFirstSplit[i] = asFirstSplit[i].slice(1);
                //}
                // look for .locn and add "intl" if it"s not _USA
                if (asFirstSplit[_i3].indexOf(".loc_U") < 0) {
                    sTemp = asFirstSplit[_i3].replace(".loc", "intl");
                } else {
                    sTemp = asFirstSplit[_i3];
                }
                if (sTemp[0] === '.') {
                    // remove .
                    sTemp = sTemp.slice(1);
                }
                asSecondSplit = asSecondSplit.concat(sTemp.split("_"));
                // replace short names with long
                for (var j = 0; j < asSecondSplit.length; j++) {
                    // replace short category names with long
                    var _iTagPos = indexOfByKey(aoTagNames, 'sShortName', asSecondSplit[j]);
                    // console.log ("iTP: ", iTagPos);
                    if (_iTagPos >= 0) {
                        asSecondSplit[j] = aoTagNames[_iTagPos].sLongName;
                        //console.log ("sTS: ", req.body.sValue[0], sSearch);            
                    }
                }
            }
            //console.log ("Calling buildCats");
            buildCategories(asFirstSplit);
            oContact[sPropName] = arrayUnique(asSecondSplit);
        } else {
            var value = nestedContent[docTitle];
            //get rid of %, and the comma after thousands
            value = value.toString().replace(/[%,]/g, "");
            if (nestedContent[docTitle] !== "") {
                oContact[sPropName] = value;
            }
        }
    });

    // now put it into the database
    aoContacts.shift(); // remove the one used
    //    console.log ("aoC length: ", aoContacts.length);
    connFns.insertContact(oContact, aoContacts.length === 0); // iCount 0 except for first call
    iRows++;
    return;
};