//import 'isomorphic-fetch';

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 8000;
const ROOT_URL = dev ? `http://localhost:${port}` : 'http://tobycontacts.ddns.net';

async function sendRequest(path, options = {}) {
  const headers = {
    'Content-type': 'application/json; charset=UTF-8',
  };

  console.log (`sR: ${ROOT_URL}${path}`);
  const response = await fetch(
    `${ROOT_URL}${path}`,
    Object.assign({
      method: 'POST',
      credentials: 'include'
    }, {
      headers
    }, options),
  );

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }
  console.log("sR got data: ", data);
  return data;
}

export async function getList () {
  console.log ("getList: /categories");
  return await sendRequest('/categories', {
    method: 'GET',
  });
}

export async function getContacts (asSearchStrings) {
  console.log ("getContacts: /contacts");
  return await sendRequest('/contacts', {
    body: JSON.stringify ({'search': asSearchStrings}),
    method: 'POST'
  });
}