 
const Joi = require('joi');
const Boom = require('boom');

const responsSchemes = require('../../libs/responsSchemes');
const staxLib = require('../../libs/stax');
 
async function response(request) {
  const messages = request.getModel(request.server.config.db.database, 'messages');
  
  let dbMessages = await messages.findAll({ where: { device_id: request.params.device_id }});
  let resMessages = [];
  for (let k in dbMessages) {
    let staxData;
  
    try {
      staxData = await staxLib.getMessage(dbMessages[k].dataValues.stax_id);
    } catch(err) {
      console.log('stax error', err);
    }
  
    if( !staxData ) {
      console.warn('Transaction found in SQLite but not found in Stax', dbMessages[k].dataValues);
      continue;
    }

    staxData.stax_id = dbMessages[k].dataValues.stax_id;

    resMessages.push(staxData);
  }
   
  return {
    meta: {
      total: 0,
      count: 0,
      offset: 0,
      error: null
    },
    data: resMessages
  };
}

const responseScheme = Joi.object({
  meta: responsSchemes.meta,
  data: Joi.array().items(Joi.object({
    device_id: Joi.string().example('aa:bb:cc:ee'),
    stax_id: Joi.string().required().example('aa:bb:cc:dd:ee:ff'),
    message: Joi.string().example('aLorem ipsum'),
    signature: Joi.string().example('zxczxczxc'),
    public_key: Joi.string().example('qweqweqwqwqwr'),
    createdAt: Joi.date().example(new Date()),
  }))
});

module.exports = {
  method: 'GET',
  path: '/messages/devices/{device_id}',
  options: {
    handler: response,
    description: 'Read all messages from the storage by device id',
    tags: ['api'],
    auth: false,
    validate: {
      params: {
        device_id: Joi.string().required().example('aa:bb:cc:dd:ee:ff')
      }
    },
    response: { schema: responseScheme } 
  }
};
 
