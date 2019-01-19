
const Joi = require('joi');
let crypto = require('crypto');

const responsSchemes = require('../../libs/responsSchemes');

async function response(request) {

  let sign = crypto.createSign('RSA-SHA256');
  sign.update(request.payload.data);
  let sig = sign.sign(request.payload.privKey, 'hex');

  return {
    meta: {
      total: 1,
      count: 1,
      offset: 0,
      error: null
    },
    data: [ sig ]
  };
}

const responseScheme = Joi.object({
  meta: responsSchemes.meta,
  data: Joi.array().items( Joi.string().example('dlfknskjdfbjk') )
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
 
