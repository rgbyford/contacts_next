import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { getList } from '../lib/api/public';
import withLayout from '../lib/withLayout';
import openSocket from 'socket.io-client';

let aoCats = [];

module.exports.getCats = function () {
  return (aoCats);
}

class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
    this.timeCounter = 0;
  }

  handleTick () {
    timeCounter++;
    setState ({timeCounter: this.timeCounter});
  }

  handleSubmit(event) {
    event.preventDefault();
//    alert(`Selected file - ${this.fileInput.current.files[0].name}`);
    console.log("load button");
    let formData = new FormData();

    formData.append("avatar", event.target.files[0]);
    formData.append("clearDB", this.bClearDB);
    formData.append("clearCats", this.bClearCats);
    //initSocket();

    timerId = setInterval(() => {
      // function called
      $("#loading").html(`Loading   ${timeCounter++}`)
    }, 1000);

    var opts = {
      method: "PUT",
      body: formData
    };
    fetch("/contacts/import", opts).then(function (response) {
      return (response.text());
    }).then(function (string) {
      // console.log("res: ", string);
      //        $("body").html(string);
      //location.reload(); // essential to refresh the page
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Upload file:
          <input style={{width: "100%"}} type="file" ref={this.fileInput} />
        </label>
        <br /><br />
        <button type="submit">Submit</button>
        <p>Loading {this.timeCounter}</p>
      </form>
    );
  }
}

class LoadPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bClearCats: false,
      bClearDB: false
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
    return (
      <div style={{  margin: '0 20px' }}>
        <Head>
          <title>Load</title>
          <meta name="description" content="description for indexing bots" />
        </Head>
        <br /><br />
        <h2 style={{ textAlign: 'left' }}>Load contacts</h2>
        <h4>CSV file to upload to database</h4>
        <form>
         <label>Empty the database before loading:<input
            name="bClearDB"
            type="checkbox"
            checked={this.state.bClearDB}
            onChange={this.handleInputChange} />
         </label>
         <br /><br />
         <label>Rebuild the categories file:<input
            name="bClearCats"
            type="checkbox"
            checked={this.state.bClearCats}
            onChange={this.handleInputChange} />
         </label>
         <br /><br />
        </form>
        <FileInput />
        </div>
    );
  }
}

// LoadPage.propTypes = {
//   list: PropTypes.shape({
//     listOfItems: PropTypes.array.isRequired,
//   }).isRequired,
// };

export default withLayout(LoadPage);
