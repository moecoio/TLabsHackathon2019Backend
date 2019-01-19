 
const Joi = require('joi');

const responsSchemes = require('../../libs/responsSchemes');
const verify = require('../../libs/verify');
 
async function response(request) {

  let result = verify.validateData(request.payload.payload, request.payload.signature, request.payload.public_key)

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
 
