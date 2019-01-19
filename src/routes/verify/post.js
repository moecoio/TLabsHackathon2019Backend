 
const Joi = require('joi');
let crypto = require('crypto');

const responsSchemes = require('../../libs/responsSchemes');
 
async function response(request) {

  const verify = crypto.createVerify('RSA-SHA1');
  verify.update(request.payload.payload);
  verify.end();
  
  let result = verify.verify(request.payload.public_key, request.payload.signature, 'hex');

  return {
    meta: {
      total: 0,
      count: 0,
      offset: 0,
      error: null
    },
    data: result
  };
}

const responseScheme = Joi.object({
  meta: responsSchemes.meta,
  data: Joi.boolean().example(true)
});

module.exports = {
  method: 'POST',
  path: '/verify',
  options: {
    handler: response,
    description: 'Verify signature',
    tags: ['api'],
    auth: false,
    validate: {
      payload: {
        public_key: Joi.string().required().example('qweqweqwqwqwr'),
        payload: Joi.string().required().example('Lorem ipsum'),
        signature: Joi.string().required().example('asdasdasd')
      }
    },
    response: { schema: responseScheme } 
  }
};
 
