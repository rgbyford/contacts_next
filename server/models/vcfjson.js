let dbStuff = require("./database.js");
let fs = require('fs');

//var util = require('util');
//var vCard = require('vcard');
//var card = new vCard();
/* Use readFile() if the file is on disk. */
//card.readFile("test.vcf", function (err, json) {
//    console.log(util.inspect(json));
//});

module.exports.vcfJson = function (file) {
    let iTels = 1;
    let iEmails = 1;
    let iPhotos = 1;
    let iOrgs = 1;
    let iTitles = 1;
    let iURLs = 1;
    let iAdrs = 1;
    let asTemp = [];
    let asFirst = [];
    let asSecond = [];
    let oContact = {};
    let asLines = [];
    let i;
    let iCards = 0;

    console.log("vcfJson");
    dbStuff.clearContacts('VCF');
    dbStuff.readCatsFile(); // read in existing categories
    // When the file is a local file we need to convert to a file Obj.
    let fd = fs.openSync ("./uploads/" + file, 'r+');
//    var content = fs.readFileSync("./uploads/" + file, "utf8");
    var content = fs.readFileSync(fd, "utf8");
    asLines = content.split('\r\n');
    console.log ('length: ', asLines.length);
    for (i = 0; i < asLines.length - 1; i++) {
        //console.log ('i: ', i);
        //console.log (`|${asLines[i]}|`);
        if (asLines[i].length < 2) {
            continue;
        }
        let j = i;
        while (asLines[i + 1][0] === ' ') {
            asLines[j] += asLines[i + 1].substr(1);
            //console.log (`&${asLines[j]}&`);
            i++;
        }
        // we'd split, but only want the first :
        // because of things like 'https://'
        let k;
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
                let sTel = iTels.toString();
                oContact['Phone' + sTel + '-Type'] = asFirst[1].substr(5);  // remove TYPE=
                oContact['Phone' + sTel + '-Value'] = asSecond[0];
                iTels++;
                break;
            case 'EMAIL':
                let sEmail = iEmails.toString();
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
                let sPhoto = iPhotos.toString();
                oContact['Photo' + sPhoto + ''] = asSecond[0];
                iPhotos++;
                break;
            case 'ORG':
                let sOrg = iOrgs.toString();
                oContact['Organization' + sOrg + '-Name'] = asSecond[0];
                iOrgs++;
                break;
            case 'TITLE':
                let sTitle = iTitles.toString();
                oContact['Organization' + sTitle + '-Title'] = asSecond[0];
                iTitles++;
                break;
            case 'URL':
                let sURL = iURLs.toString();
                oContact['Website' + sURL + ''] = asSecond[0];
                iURLs++;
                break;
            case 'NOTE':
                oContact['Notes'] = asSecond[0];
                break;
            case 'ADR':
                let sAdr = iAdrs.toString();
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
    console.log ("vcfJson complete, ", iCards, " names");
    dbStuff.importNames(iCards);
    fs.closeSync (fd);
    fs.unlinkSync('./uploads/' + file);
};