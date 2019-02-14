import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { getList } from '../lib/api/public';
import withLayout from '../lib/withLayout';

let aoCats = [];

module.exports.getCats = function () {
  return (aoCats);
}

class SSR extends React.Component {
  static async getInitialProps() {
    aoCats = await getList();
    return { aoCats };
  }

  render() {
    const { list } = this.props;
    return (
      <div style={{ textAlign: 'center', margin: '0 20px' }}>
        <Head>
          <title>SSR page</title>
          <meta name="description" content="description for indexing bots" />
        </Head>
        <br />
        <h3 style={{ textAlign: 'left' }}>List</h3>
        {list.listOfItems.length > 0 ? (
          <ul style={{ textAlign: 'left' }}>
        {list.listOfItems.map(i => <li key={i.name}>{i.name}</li>)}
          </ul>
        ) : null}
      </div>
    );
  }
}

SSR.propTypes = {
  list: PropTypes.shape({
    listOfItems: PropTypes.array.isRequired,
  }).isRequired,
};

export default withLayout(SSR);
