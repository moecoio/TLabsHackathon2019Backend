
let crypto = require('crypto');

function validateData(data, sign, pub_key) {
  const _publicKey = crypto.createPublicKey({
    key: Buffer.from(pub_key,'hex'),
    format: 'der',
    type:'spki'
  });
  
  const _signature = Buffer.from(sign, 'hex');
  const _data = Buffer.from(data, 'hex');
  
  const verify = crypto.createVerify('RSA-SHA1');
  verify.update(_data);
  verify.end();
  
  let result = false;
  
  try {
    result = verify.verify(_publicKey, _signature);
  } catch(err) {
    console.log('ERR:', err);
  }
  
  return result;
}

module.exports = {
  validateData: validateData
}
