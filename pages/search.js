import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
//import ListChoose from '../components/listChoose';
import { getList, getContacts } from '../lib/api/public';

import withLayout from '../lib/withLayout';

//let sSearchString = "";
let sSubCatOf;
let iAnds;
let asSearchStrings = [];
let iCatsSelected;
let sSelect;

class CSRWithData extends React.Component {
  constructor(props) {
    super(props);
    this.list = null;
    this.loading = true;
    this.sCat = [];
    this.catSelect = this.catSelect.bind(this);
    this.nextButton = this.nextButton.bind(this);
    this.andButton = this.andButton.bind(this);
    this.searchButton = this.searchButton.bind(this);
    this.aoFound = [{}];
    sSubCatOf = "";
    iAnds = 0;
    asSearchStrings = [];
    asSearchStrings[0] = "";
    iCatsSelected = 0;
  }

  async componentDidMount() {
    try {
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

  nextButton (e) {
    if (asSearchStrings[iAnds] != "") {
      asSearchStrings[iAnds] += " _ ";
    }
    console.log ("next button: ", this.sCat);
    //iCatsSelected++;
    asSearchStrings[iAnds] += this.sCat.join (' OR ');
    console.log ("searchString: ", asSearchStrings[iAnds]);
    sSubCatOf = this.sCat[0];          // deal with the fact that this is an array
    iCatsSelected++;
    //bCatSelected = false;
    this.setState ({sCat: []});
  }

  async searchButton () {
    console.log ("Search button");
    let aoContacts = await getContacts(asSearchStrings);
    console.log ("aoFound: ", aoContacts);
    this.setState ({aoFound: aoContacts});
    return;
  }

  catSelect = (e) => {
    this.sCat = [].filter.call(e.target.options, o => o.selected).map(o => o.value);
    //bCatSelected = true;
    sSelect = this.sCat[0];
    console.log ("catSelect: ", this.sCat);
  }

  andButton () {
//    console.log ("AND button: ", asSearchStrings[iAnds], iAnds);
    iAnds++;
    iCatsSelected = 0;
    asSearchStrings[iAnds] = "";
    sSubCatOf = "";
    this.setState ({sCat: []});
    //bCatSelected = false;
  }
  
  csr(state) {
      let aoCatsList = [{}];
  //console.log (`CSR props:`, {this.props});
    if (state.loading) {
//      console.log ("CSR - loading");
      return (
      <div style={{ padding: '10px 45px' }}>
        <p>loading...(CSR page without data)</p>
      </div>
      );
    }
    console.log ("iCatsSelected: ", iCatsSelected);
    if (state.list != undefined) {
        console.log ("iCS aoCL[0] aoCL.length: ", iCatsSelected, "|", aoCatsList[0], "|",  aoCatsList.length);
      if ((iCatsSelected >= 3) || (aoCatsList.length >= 2)) {
        console.log ("iAnds++");
        sSubCatOf = "";
        iCatsSelected = 0;
        iAnds++;
        asSearchStrings[iAnds] = "";
        this.sCat = [];
      }
      do {
        let j = 0;
        for (let i = 0; i < state.list.aoCats.length; i++) {
          if (state.list.aoCats[i].sIsSubCatOf === sSubCatOf) {
            aoCatsList.push(state.list.aoCats[i]);
            aoCatsList[j].key = j++;
          }
        }
        console.log("set aoCL");
        if (aoCatsList.length < 2) {
          console.log("aoCL length: ", aoCatsList.length);
          sSubCatOf = "";
          iCatsSelected = 0;
          this.sCat = [];
          iAnds++;
          asSearchStrings[iAnds] = "";
        }
      } while (aoCatsList.length < 2);
    }
    let bAllowMult = (sSubCatOf !== "") && (aoCatsList.length > 1);

    console.log("CSR aoCatsList[0]: ", aoCatsList[0].sThisCat);
    console.log ("asSS: ", asSearchStrings);
    console.log ("sCat: ", this.sCat);
    console.log ("iAnds: ", iAnds);
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
    aoCatsList.sort((a,b) => (a.sThisCat > b.sThisCat) ? 1 : (b.sThisCat > a.sThisCat) ? -1 : 0);
            aoCatsList[0].sThisCat = "any"; // first elemeent is undefined, so ...
        aoCatsList[0].sIsSubCatOf = "";

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
      {asSearchStrings.map((x, y) => <p key={y}>{y > 0 ? 'AND ': ""} {x}{'\u00A0'}</p>)}
        <select size='10' multiple={bAllowMult ? true : false} onChange={(e) => this.catSelect(e)}>
        {aoCatsList.map((x, y) => <option key = {y}> {x.sThisCat} </option>)}
        </select>
      {this.sCat.length < 2 ? <button onClick={(e) => this.nextButton(e)}>Next</button> : ""}
      {this.sCat.length ? <button onClick={this.andButton}>AND</button> : ""}
      <button onClick={this.searchButton}>Search</button>
      <div>
      {aoFoundPeople.map((x, y) => <div key={y}>
      <p>{x.GivenName} {x.FamilyName}
      {x['Phone1-Value']}  {x['E-mail1-Value']}</p>
      <img style={{width: 100}} src={x.Photo1}/></div>)}
      </div>
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
