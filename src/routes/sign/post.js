
const Joi = require('joi');
let crypto = require('crypto');
const NodeRSA = require('node-rsa');

const responsSchemes = require('../../libs/responsSchemes');

async function response(request) {
  
  let _privateKey = new NodeRSA({}, null, {
    signingScheme: {
        hash: 'sha1'
    }
  });
  
  try {
    _privateKey.importKey(Buffer.from(request.payload.privKey, 'hex'), 'pkcs8-private-der');
  } catch(err) {
    console.log('ERR:', err);
  }
  
  //let sig = _privateKey.sign(Buffer.from(request.payload.data, 'hex'), 'hex');
  let sig = _privateKey.sign(request.payload.data, 'hex');

  return {
    meta: {
      total: 1,
      count: 1,
      offset: 0,
      error: null
    },
    data: sig
  };
}

const responseScheme = Joi.object({
  meta: responsSchemes.meta,
  data: Joi.string().example('dlfknskjdfbjk')
});

module.exports = {
  method: 'POST',
  path: '/sign',
  options: {
    handler: response,
    description: 'Sign data via cert',
    tags: ['api'],
    auth: false,
    validate: {
      payload: {
        data: Joi.string().required().example('Hello world'),
        privKey: Joi.string().required().example('sdnflkjoiu3o4rub'),
      }
    },
    response: { schema: responseScheme } 
  }
};
 
