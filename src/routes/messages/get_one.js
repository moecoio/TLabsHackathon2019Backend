
const Joi = require('joi');
const Boom = require('boom');

const responsSchemes = require('../../libs/responsSchemes');
const staxLib = require('../../libs/stax');

async function response(request) {
  
  let staxData;
  
  try {
    staxData = await staxLib.getMessage(request.params.stax_id);
  } catch(err) {
    // not found
  }
  
  if( !staxData ) {
    throw Boom.notFound('Transaction not found');
  }
  
  return {
    meta: {
      total: 1,
      count: 1,
      offset: 0,
      error: null
    },
    data: [ staxData ]
  };
}

const responseScheme = Joi.object({
  meta: responsSchemes.meta,
  data: Joi.array().items(Joi.object({
    device_id: Joi.string().example('aa:bb:cc:ee'),
    message: Joi.string().example('aLorem ipsum'),
    signature: Joi.string().example('zxczxczxc'),
    public_key: Joi.string().example('qweqweqwqwqwr'),
    createdAt: Joi.date().example(new Date()),
  }))
});

module.exports = {
  method: 'GET',
  path: '/messages/{stax_id}',
  options: {
    handler: response,
    description: 'Get message by stax_id',
    tags: ['api'],
    validate: {
      params: {
        stax_id: Joi.string().required().example('asdqwerty')
      }
    },
    response: { schema: responseScheme } 
  }
}; 
