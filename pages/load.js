import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
//import { getList } from '../lib/api/public';
import withLayout from '../lib/withLayout';
import socketIOClient from 'socket.io-client';
import {Table, Thead, Th, Tr,Td} from 'reactable';
import { getLoadDate } from '../lib/api/public';

let aoCats = [];
let timerId;
 
module.exports.getCats = function () {
  return (aoCats);
}

class MyTable extends React.Component {
  render() {
    return (<Table className = "table">
           <Thead>
          <Th column="firstName">
            <strong className="name-header">First Name</strong>
          </Th>
          <Th column="lastName">
            <strong className="name-header">Last Name</strong>
          </Th>
        </Thead>
        {this.props.tableData.map(x=><Tr> <Td column="firstName">{x.givenName}</Td> <Td column="lastName">{x.familyName}</Td></Tr>)}
      </Table>
    );
  }
}

class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
    this.timeCounter = 0;
    this.state = {
      timeCounter: 0,
      names: [],
      response: false
    }
  }

  async componentDidMount() {
 
    const socket = socketIOClient();
    socket.on('news', (data) => {
      console.log ("something received: ", data);
      let jsonRcvd = JSON.parse (data.something);
      this.state.names = [];
      for (let i = 0; i < jsonRcvd.length; i++) {
        let oName = {};
        oName.id = i;
        oName.givenName = jsonRcvd[i].GivenName;
        oName.familyName = jsonRcvd[i].FamilyName;
        this.state.names.push(oName);
      }
      //this.state.names = JSON.parse (data.something);
      console.log ("state.names[1]: ", this.state.names[1]);
      socket.close ();
      clearInterval (timerId);
      this.setState({ response: true })
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("load button");
    console.log ("props: ", this.props);
    console.log ("state: ", this.state);
    let formData = new FormData();
    let fname = this.fileInput.current.files[0].name;
    console.log ('fname: ', fname);
    
    formData.append("avatar", this.fileInput.current.files[0]);
    formData.append("clearDB", this.props.bClearDB);
    formData.append("clearCats", this.props.bClearCats);
    formData.append("csv", fname.indexOf("csv") > 0 ? 'true' : 'false');
    //initSocket();
    
    timerId = setInterval(() => {
      // function called
      this.timeCounter++;
      this.setState ({timeCounter: this.timeCounter});
    }, 1000);

    var opts = {
      method: "PUT",
      body: formData
    };
    fetch("/contacts/import", opts).then(function (response) {
      return (response.text());
    }).then(function (string) {
      console.log("res: ", string);
      //        $("body").html(string);
      //location.reload(); // essential to refresh the page
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Upload file:
          <input style={{width: "100%"}} accept=".csv, .CSV, .vcf, .VCF" type="file" ref={this.fileInput} />
        </label>
        <br /><br />
        <button type="submit"><strong>Submit</strong></button>
        <div>
        {this.state.response
          ? <div><p>Loading done.
            Near-duplicates:</p><MyTable tableData={this.state.names} /></div>
          : <p>Loading {this.state.timeCounter}</p>
        }</div>
      </form>
    );
  }
}

class LoadPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bClearCats: false,
      bClearDB: false,
      date: ''
    };

//    this.handleClearDB = this.handleClearDB.bind(this);
//    this.handleClearCats = this.handleClearCats.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  // static async getInitialProps() {
  // }

  // handleClearDB () {
  //   console.log ("clear DB");
  //   this.setState ({bClearDB: !bClearDB});
  // }

  // handleClearCats () {
  //   console.log ("clear cats");
  //   this.setState ({bClearCats: !bClearCats});
  // }
  async componentDidMount () {
   try {
      console.log ("CDM before gLD call");
      const date = await getLoadDate();
      console.log("CDM:", date);
      this.setState({ // eslint-disable-line
        date: date
      });
      //bCatSelected = false;
    } catch (err) {
      this.setState({ loading: false, error: err.message || err.toString() }); // eslint-disable-line
    }
  }

  handleInputChange(event) {
    console.log ("Input change", event.target.name, event.target.type, event.target.checked);
//    const target = event.target;
//    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = event.target.name;

    this.setState({
      [name]: event.target.checked
    });
  }

  render() {
    const { list } = this.props;
    let buttonStyle = {width: "16px", height: "16px"};

    return (
      <strong>
      <div style={{  margin: '0 20px' }}>
        <Head>
          <title>Load</title>
          <meta name="description" content="description for indexing bots" />
        </Head>
        <style global jsx>{`
      body {
        background-image: url("/static/oriental.png");
      }
      `}</style>
        <br /><br />
        <h2 style={{ textAlign: 'left' }}>Load contacts (last loaded {this.state.date})</h2>
        <h4>CSV file to upload to database</h4>
        <form>
         <label>Empty the database before loading: <input
            style={buttonStyle}
            name="bClearDB"
            type="checkbox"
            checked={this.state.bClearDB}
            onChange={this.handleInputChange} />
         </label>
         <br /><br />
         <label>Rebuild the categories file: <input
            style={buttonStyle}
            name="bClearCats"
            type="checkbox"
            checked={this.state.bClearCats}
            onChange={this.handleInputChange} />
         </label>
         <br /><br />
        </form>
        <FileInput bClearDB={this.state.bClearDB} bClearCats={this.state.bClearCats} />
        </div>
        </strong>
    );
  }
}

// LoadPage.propTypes = {
//   list: PropTypes.shape({
//     listOfItems: PropTypes.array.isRequired,
//   }).isRequired,
// };

export default withLayout(LoadPage);
