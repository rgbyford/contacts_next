"use strict";

var dbStuff = require("./database.js");
var fs = require('fs');

//var util = require('util');
//var vCard = require('vcard');
//var card = new vCard();
/* Use readFile() if the file is on disk. */
//card.readFile("test.vcf", function (err, json) {
//    console.log(util.inspect(json));
//});

module.exports.vcfJson = function (file) {
    var iTels = 1;
    var iEmails = 1;
    var iPhotos = 1;
    var iOrgs = 1;
    var iTitles = 1;
    var iURLs = 1;
    var iAdrs = 1;
    var asTemp = [];
    var asFirst = [];
    var asSecond = [];
    var oContact = {};
    var asLines = [];
    var i = void 0;
    var iCards = 0;

    console.log("vcfJson");
    dbStuff.clearContacts('VCF');
    dbStuff.readCatsFile(); // read in existing categories
    // When the file is a local file we need to convert to a file Obj.
    var fd = fs.openSync("./uploads/" + file, 'r+');
    //    var content = fs.readFileSync("./uploads/" + file, "utf8");
    var content = fs.readFileSync(fd, "utf8");
    asLines = content.split('\r\n');
    console.log('length: ', asLines.length);
    for (i = 0; i < asLines.length - 1; i++) {
        //console.log ('i: ', i);
        //console.log (`|${asLines[i]}|`);
        if (asLines[i].length < 2) {
            continue;
        }
        var j = i;
        while (asLines[i + 1][0] === ' ') {
            asLines[j] += asLines[i + 1].substr(1);
            //console.log (`&${asLines[j]}&`);
            i++;
        }
        // we'd split, but only want the first :
        // because of things like 'https://'
        var k = void 0;
        for (k = 0; k < asLines[j].length; k++) {
            if (asLines[j][k] === ':') {
                break;
            }
        }
        asFirst = asLines[j].slice(0, k).split(';');
        asSecond = asLines[j].slice(k + 1).split(';');
        //        asTemp = asLines[j].split(':', 1);
        //        asFirst = asTemp[0].split(';');
        //        asSecond = asTemp[1].split(';');
        switch (asFirst[0]) {
            case 'N':
                oContact['Family Name'] = asSecond[0];
                oContact['Given Name'] = asSecond[1];
                break;
            case 'TEL':
                var sTel = iTels.toString();
                oContact['Phone' + sTel + '-Type'] = asFirst[1].substr(5); // remove TYPE=
                oContact['Phone' + sTel + '-Value'] = asSecond[0];
                iTels++;
                break;
            case 'EMAIL':
                var sEmail = iEmails.toString();
                oContact['E-mail' + sEmail + '-Type'] = asFirst[1].substr(5);
                oContact['E-mail' + sEmail + '-Value'] = asSecond[0];
                iEmails++;
                break;
            case 'X-FC-LIST-ID':
                oContact['FC_ID1'] = asSecond[0];
                break;
            case 'X-ID':
                oContact['FC_ID2'] = asSecond[0];
                break;
            case 'PHOTO':
                var sPhoto = iPhotos.toString();
                oContact['Photo' + sPhoto + ''] = asSecond[0];
                iPhotos++;
                break;
            case 'ORG':
                var sOrg = iOrgs.toString();
                oContact['Organization' + sOrg + '-Name'] = asSecond[0];
                iOrgs++;
                break;
            case 'TITLE':
                var sTitle = iTitles.toString();
                oContact['Organization' + sTitle + '-Title'] = asSecond[0];
                iTitles++;
                break;
            case 'URL':
                var sURL = iURLs.toString();
                oContact['Website' + sURL + ''] = asSecond[0];
                iURLs++;
                break;
            case 'NOTE':
                oContact['Notes'] = asSecond[0];
                break;
            case 'ADR':
                var sAdr = iAdrs.toString();
                oContact['Address' + iAdrs + '-Street'] = asSecond[2];
                oContact['Address' + iAdrs + '-City'] = asSecond[3];
                oContact['Address' + iAdrs + '-State'] = asSecond[4];
                oContact['Address' + iAdrs + '-PostalCode'] = asSecond[5];
                oContact['Address' + iAdrs + '-Country'] = asSecond[6];
                iAdrs++;
                break;
            case 'CATEGORIES':
                oContact['Group Membership'] = asSecond[0];
                break;

            case 'END':
                iTels = 1;
                iEmails = 1;
                iPhotos = 1;
                iOrgs = 1;
                iTitles = 1;
                iURLs = 1;
                iAdrs = 1;
                dbStuff.pushContact(oContact);
                oContact = {};
                iCards++;
                break;
            default:
                break;
        }
    }
    console.log("vcfJson complete, ", iCards, " names");
    dbStuff.importNames(iCards);
    fs.closeSync(fd);
    fs.unlinkSync('./uploads/' + file);
};