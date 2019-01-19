
const __stax_node_url = 'http://localhost:9191/storage'; // hardcoded now
const __stax_keys_chain = '0x57747b46770aa19e1b5d282efa5f85af7292cbb0';
const __stax_data_chain = '0x1874d8863A29cf5f1f0920ff6c1E450ba583BB99';

const rp = require('request-promise');

async function addPublicKey(device_id, public_key, createdAt) {
  let options = {
    method: 'POST',
    uri: __stax_node_url,
    headers: {
      'content-type': 'application/json',
      'originator-ref': __stax_keys_chain
    },
    body: JSON.stringify({
      device_id: device_id,
      public_key: public_key,
      createdAt: createdAt
    })
  };
  
  let result = JSON.parse(await rp(options));  
  return result.ref_id;
}

async function getPublicKey(stax_id) {
  
  let options = {
    method: 'GET',
    uri: `${__stax_node_url}/${stax_id}`,
    headers: {
      'content-type': 'application/json',
    }
  };
  
  return JSON.parse(await rp(options));
}

async function addMessage(data) {
  let options = {
    method: 'POST',
    uri: __stax_node_url,
    headers: {
      'content-type': 'application/json',
      'originator-ref': __stax_data_chain
    },
    body: JSON.stringify(data)
  };
  
  let result = JSON.parse(await rp(options));  
  return result.ref_id;
}

async function getMessage(stax_id) {
  
  let options = {
    method: 'GET',
    uri: `${__stax_node_url}/${stax_id}`,
    headers: {
      'content-type': 'application/json',
    }
  };
  
  return JSON.parse(await rp(options));
}

module.exports = {
  addPublicKey: addPublicKey,
  getPublicKey: getPublicKey,
  addMessage: addMessage,
  getMessage: getMessage
};
