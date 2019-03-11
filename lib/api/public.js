import 'isomorphic-fetch';

const dev = true;
//const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 9000;
//const ROOT_URL = dev ? `http://localhost:${port}` : 'http://tobycontacts.ddns.net/cnext';
const ROOT_URL = '';
console.log (`NODE_ENV: ${process.env.NODE_ENV} dev: ${dev}`);

async function sendRequest(path, options = {}) {
  const headers = {
    'Content-type': 'application/json; charset=UTF-8',
  };

  console.log (`sR: ${ROOT_URL}${path}`);
  const response = await fetch(
    encodeURI (`${ROOT_URL}${path}`),
    Object.assign({
      method: 'POST',
      credentials: 'include'
    }, {
      headers
    }, options)
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
  let sQuery = '';
  let i;
  console.log ('asSS: ', asSearchStrings);
  for (i = 0; i < asSearchStrings.length - 2; i++) {
    // asSS has '' as the last string
    console.log ('string build: ', i, asSearchStrings[i]);
    sQuery += asSearchStrings[i];
    sQuery += '@';
  }
  sQuery += asSearchStrings[i];
  console.log ('string finish: ', i, asSearchStrings[i]);
  
  return await sendRequest(`/contacts?q=${sQuery}`, {
//    body: JSON.stringify ({'search': asSearchStrings}),
    method: 'GET'
  });
}