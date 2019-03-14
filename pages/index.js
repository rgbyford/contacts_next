import React from 'react';
import Head from 'next/head';

import withLayout from '../lib/withLayout';

function Index() {
  return (
    <div style={{ padding: '10px 45px' }}>
      <Head>
        <title>Prodigium</title>
        <meta name="description" content="" />
      </Head>
      <style global jsx>{`
      body {
        background-image: url("/static/oriental.png");
      }
      `}</style>
      <h1>Prodigium Contact Search</h1>
    </div>
  );
}

export default withLayout(Index);
