
const __stax_node_url = 'http://localhost:9191/storage'; // hardcoded now
const __stax_keys_chain = '0x57747b46770aa19e1b5d282efa5f85af7292cbb0';
const __stax_data_chain = '0x57747b46770aa19e1b5d282efa5f85af7292cbb1';

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
  }
  
  let result = JSON.parse(await rp(options));  
  return result.ref_id;
}


module.exports = {
  addPublicKey: addPublicKey
}
