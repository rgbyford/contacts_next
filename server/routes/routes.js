let express = require("express");
let router = express.Router();
const cjFns = require("../models/csvjson.js");
const dbFunctions = require("../models/database.js");
const dbConn = require("../models/connection.js");
let aoCats = [{}];
let asPrev = [];
let iAnds = -1;
let bAndBtnDisabled = false;
let bClearedDB = false;

router.get('/categories', async (req, res) => {
    console.log("server get cats");
    try {
        aoCats = dbFunctions.readCatsFile();
        res.json({
            aoCats
        }); // and sends it
    } catch (err) {
        console.log("categories fetch error");
        res.json({
            error: err.message || err.toString()
        });
    }
});

router.post("/contacts", async function (req, res) {
    console.log("post contacts");
    //    setPrevious();
    //    iAnds = -1;
    let asSearchAnd = [];
    let asSearchOr = [];

    console.log("search body: ", req.body);
    for (let i = 0; i < req.body.search.length; i++) {
        let sFind = req.body.search[i];
        console.log("sFind: ", sFind);
        //    console.log ("sFind[0]: ", sFind[0]);

        //    asPrev.forEach((sFind, index) => {
        //console.log("sFind: ", sFind);
        sFind = sFind.trim();
        //console.log(`sFind trimmed: *${sFind}*`);
        let asFinds = sFind.split("&");
        //console.log(`asFinds: ${asFinds}`);
        //console.log(`asFinds.length ${asFinds.length}`);
        if (asFinds.length > 1) { //['x y']
            asFinds.forEach((sCat, j) => {
                let asFindBars = sCat.split("|");
                if (asFindBars.length > 1) {
                    // there's an OR
                    asFindBars.forEach((sCatOr) => {
                        asSearchOr.push(sCatOr);
                    });
                } else {
                    if (sCat !== "any") {
                        //console.log(`pushing and 1: ${sCaT}`);
                        asSearchAnd.push(sCat);
                    }
                }
            });
        } else { // no &
            if (asFinds[0].length) {
                //console.log(`pushing and 2: |${asFinds[0]}|`);
                asSearchAnd.push(asFinds[0]);
            }
        }
    }
    for (let i = 0; i < asSearchAnd.length; i++) {
        asSearchAnd[i] = asSearchAnd[i].replace(/\s/g, '');
        console.log(`asSA spaces removed: |${asSearchAnd[i]}|`);
    }
    for (let i = 0; i < asSearchOr.length; i++) {
        asSearchOr[i] = asSearchOr[i].replace(/\s/g, '');
        console.log(`asSO spaces removed: |${asSearchOr[i]}|`);
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
        if (aoFound.length === undefined || aoFound.length <= 1) { // none found
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
        for (let i = 0; i < aoFound.length; i++) {
            aoFound[i].itemNum = i;
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
            aoFound
        }); // and sends it
    });

    return;
});

module.exports = router;