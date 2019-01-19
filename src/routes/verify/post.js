 
const Joi = require('joi');
const responsSchemes = require('../../libs/responsSchemes');
 
async function response(request) {
  
  //const messages = request.getModel(request.server.config.db.database, 'messages');
  
  let result = true;

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
    description: 'Add device pubic key',
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
 
