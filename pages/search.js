import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
//import ListChoose from '../components/listChoose';
import { getList, getContacts } from '../lib/api/public';

import withLayout from '../lib/withLayout';

const NUM_ANDS = 4;

class oSearch {
  constructor () {
    this.iSearches = 0,
    this.sSearch = "",
    this.asSelect = [],
    this.bNext = false,
    this.bAnd = false,
    this.bSearch = true,
    this.sSubCatOf = "",
    this.iCatSearches = 0,
    this.bComplete = false,
    this.aoCatsList = [{}],
    this.sCat = [],
    this.bAllowMult = false
  }
};

let aiCatsSelected = [];
let aoSearch = [];
aoSearch[0] = new oSearch;
aoSearch[0].bNext = true;
let bRefining;
let sSubCatOf;

let iTotalRows = 0;   // easy way, rather than checking aoSearch

function deepCopy(o) {
    var copy = o,k;
 
    if (o && typeof o === 'object') {
        copy = Object.prototype.toString.call(o) === '[object Array]' ? [] : {};
        for (k in o) {
            copy[k] = deepCopy(o[k]);
        }
    }
    return copy;
}


class CSRWithData extends React.Component {
  constructor(props) {
    super(props);
    this.list = null;
    this.loading = true;
    this.sAddCat = [];
//    this.catSelect = this.catSelect.bind(this);
    this.nextButton = this.nextButton.bind(this);
    this.andButton = this.andButton.bind(this);
    this.searchButton = this.searchButton.bind(this);
    this.aoFound = [{}];
    sSubCatOf = "";
    //iAnds = 0;
    //asSearchStrings = [];
    //asSearchStrings[0] = "";
    aiCatsSelected[0] = 0;
    this.iCounter = 0;
  }

  async componentDidMount() {
    try {
      iTotalRows = 1;
      bRefining = false;
      console.log ("CDM before gL call");
      const list = await getList();
      console.log("CDM:", list);
      this.setState({ // eslint-disable-line
        list: list,
        loading: false,
      });
      //bCatSelected = false;
    } catch (err) {
      this.setState({ loading: false, error: err.message || err.toString() }); // eslint-disable-line
    }
  }

  // nextNextButton (e) {
  //   asSearchStrings[0] += " _ ";
  //   console.log ("nextNext button: ", this.sCat);
  //   //aiCatsSelected++;
  //   asSearchStrings[0] += this.sAddCat.join (' OR ');
  //   console.log ("searchString: ", asSearchStrings[iAnds]);
  //   sSubCatOf = this.sAddCat[0];          // deal with the fact that this is an array
  //   aiCatsSelected[0]++;
  //   //bCatSelected = false;
  //   this.setState ({sCat: []});
  // }

  async searchButton () {
    console.log ("Search button");
    bRefining = true;
    let asSearch = [];  // api is written to use array of strings
    for (let i = 0; i < iTotalRows; i++) {
      asSearch[i] = aoSearch[i].sSearch;
    }
    let aoContacts = await getContacts(asSearch);
    console.log ("aoFound: ", aoContacts);
    this.setState ({aoFound: aoContacts});
    return;
  }

  // catSelect = (e) => {
  //   this.sCat = [].filter.call(e.target.options, o => o.selected).map(o => o.value);
  //   //bCatSelected = true;
  //   //sSelect = this.sCat[0];
  //   console.log ("catSelect: ", this.sCat);
  // }

  catAddSelect = (e, iRow) => {
    aoSearch[iRow].sCat = [].filter.call(e.target.options, o => o.selected).map(o => o.value);
    console.log ("caAddSelect: ", aoSearch[iRow].sCat);
  }

  andButton = param => e => {
    aoSearch[param].bAnd = false;
    aoSearch[param].bSearch = false;
    console.log ('AND iCatSearches: ', aoSearch[param].iCatSearches);
    //if (aoSearch[param].iCatSearches < 3) {
      //bRefining = true;
    //}
    iTotalRows++;
    aoSearch[iTotalRows - 1] = new oSearch;
    aoSearch[iTotalRows - 1].bNext = true;
    this.setState ({iCounter: this.state.iCounter++});    // just to cause refresh
  }
  
  nextButton = param => e => {
    // param is the argument you passed to the function
    // e is the event object that returned
    console.log ("next button: ", param, aoSearch[param].iCatSearches);
    aoSearch[param].iCatSearches++;
    if (aoSearch[param].sSearch != "") {
      aoSearch[param].sSearch += ' _ ';
    }
    if (aoSearch[param].iCatSearches < 3  && aoSearch[param].sCat.length < 2) {     // < 2 ==> not OR
      console.log ('sCat: ', aoSearch[param].sCat);
      console.log ('sCat length: ', aoSearch[param].sCat.length);
      aoSearch[param].bComplete = false;
      if (aoSearch[param].iCatSearches > 0) {
        aoSearch[param].bAnd = true;
      }
    }
    else {
      aoSearch[iTotalRows - 1].bComplete = true;
      aoSearch[iTotalRows - 1].bAnd = false;
      aoSearch[iTotalRows - 1].bNext = false;
      aoSearch[iTotalRows - 1].bSearch = false;
      iTotalRows++;
      aoSearch[iTotalRows - 1] = new oSearch;
      aoSearch[iTotalRows - 1].bNext = true;
    }
    aoSearch[param].sSearch += aoSearch[param].sCat.join (' OR '); // only puts in OR if there's more than one item in sCat?
    console.log ("searchString: ", aoSearch[param].sSearch);
    aoSearch[param].sSubCatOf = aoSearch[param].sCat[0];
    console.log ('asSubCatOf: ', aoSearch[param].sCat[0]);
    //sSubCatOf = this.sCat[0];          // deal with the fact that this is an array
    //aiCatsSelected[param]++;
    if (bRefining) {
      this.searchButton ();      // fake it
    }
    else {
      this.setState ({iCounter: this.state.iCounter++});    // just to cause refresh
    }
  }

  csr(state) {
    for (let iRow = 0; iRow < iTotalRows; iRow++) {
    console.log('iTR, iRow, iCatSearches: ', iTotalRows, iRow, aoSearch[iRow].iCatSearches);
      aoSearch[iRow].aoCatsList = [];
      if (aoSearch[iRow].iCatSearches < 3) {
        console.log('aoS[iR].sSCO: ', aoSearch[iRow].sSubCatOf);
        // work out select elements
        let j = 0;
        for (let i = 0; i < state.list.aoCats.length; i++) {
          if (state.list.aoCats[i].sIsSubCatOf === aoSearch[iRow].sSubCatOf) {
            aoSearch[iRow].aoCatsList.push(state.list.aoCats[i]);
            aoSearch[iRow].aoCatsList[j].key = j++;
          }
        }
      }
      aoSearch[iRow].bAllowMult = aoSearch[iRow].sSubCatOf === '' ? false : true;
      if (aoSearch[iRow].aoCatsList.length < 2) {   // can't search a list of 1
        console.log ('short row: ', iRow, aoSearch[iRow].aoCatsList.length);
        aoSearch[iRow].bComplete = true; 
        aoSearch[iRow].bNext = false;
        aoSearch[iRow].iCatSearcesMax = 2;
      }
    }

    let aoFoundPeople = [];
    if(state.aoFound !== undefined) {
      aoFoundPeople = state.aoFound.aoFound;
      aoFoundPeople.sort((a,b) => (a.FamilyName > b.FamilyName) ? 1 :
       (b.FamilyName > a.FamilyName) ? -1 : 
       ((a.GivenName > b.GivenName) ? 1 : (b.GivenName > a.GivenName) ? -1 : 0));
      //console.log ("aoFound", state.aoFound.aoFound[0].FamilyName);
    }
    else {
      aoFoundPeople = [];
    }
//    this.aoFound.map((x, y) => console.log (x.FamilyName));

    for (let i = 0; i < aoFoundPeople.length; i++) {
      aoFoundPeople[i].url = `https://app.fullcontact.com/contacts/${aoFoundPeople[i].FC_ID1}/${aoFoundPeople[i].FC_ID2}`;
//      console.log ('URL: ', aoFoundPeople[i].url);
    }
    console.log ('aoSearch len', aoSearch.length);
    console.log ('aoCatsList: ', aoSearch[0].aoCatsList);
    return (
    <div style={{ textAlign: 'center', margin: '0 20px' }}>
      <Head>
        <meta name="description" content="description for indexing bots" />
      </Head>
      <style global jsx>{`
      body {
        background-image: url("/static/oriental.png");
      }
      `}</style>
      <br />
      <h2>Search page</h2>
      <strong>
        {aoSearch.map((value1,index1) => <div key={index1}>
          <div><p>{aoSearch[index1].sSearch}</p></div>
          {aoSearch[index1].bComplete ? '' :
            <div><select size='10' multiple={aoSearch[index1].bAllowMult ? true : false} onChange={(e) => this.catAddSelect(e, index1)}>
            {aoSearch[index1].aoCatsList.map((value2, index2) => <option key = {index2}> {value2.sThisCat} </option>)}
          </select></div>}
          <div>{aoSearch[index1].bNext ? <button onClick={this.nextButton(index1)}>Next</button> : ''}</div>
          <div>{aoSearch[index1].bAnd ? <button onClick={this.andButton(index1)}>AND</button> : ''}</div>
          <div>{aoSearch[index1].bSearch ? <button onClick={this.searchButton}>Search</button> : ''}</div>
          </div>)}
      {aoFoundPeople.map((x, y) => <div key={y}>
        <p>{x.GivenName} {x.FamilyName} &nbsp;&nbsp;
        {x['Phone1-Value']}&nbsp;&nbsp;{x['E-mail1-Value']}</p>
        <img style={{width: 100}} src={x.Photo1}/>
        &nbsp;
        {x.FC_ID1 != undefined ? <a target="_blank" href={x.url}><strong>FullContact</strong></a> : ''}
      </div>)}
    </strong>
    </div>
    );
}


  render() {
    console.log (`render CSRWD: |`, {...this.state});
    // state has members as above - list is null on the first call, is {aoCats[]} on the second call
    // and loading true on the first call, false on the second
    // return <CSR {...this.props} {...this.state} />;
   return (<div> {this.csr ({...this.state})} </div>);
  }
}

export default withLayout(CSRWithData);
