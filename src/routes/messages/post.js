 
const Joi = require('joi');
const Boom = require('boom');
let crypto = require('crypto');

const responsSchemes = require('../../libs/responsSchemes');
const staxLib = require('../../libs/stax');

function validateData(data, sign, pub_key) {
  const verify = crypto.createVerify('RSA-SHA1');
  verify.update(data);
  verify.end();
  
  let result = false;
  
  try {
    result = verify.verify(pub_key, sign, 'hex');
  } catch(err) {
    console.log('ERR:', err);
  }
  
  return result;
}
 
async function response(request) {
  
  const devices = request.getModel(request.server.config.db.database, 'devices');
  const messages = request.getModel(request.server.config.db.database, 'messages');
  
  let curDevice = await devices.findOne({ where: { device_id: request.payload.device_id }});
  
  if( !curDevice ) {
    throw Boom.notFound('Device not found');
  }
  
  if( !validateData(request.payload.message, request.payload.signature, curDevice.dataValues.public_key) ) {
    throw Boom.badRequest('Signature is invalid');
  }

  let newMessage = Object.assign({}, request.payload);
  let curDate = new Date();
  
  newMessage.public_key = curDevice.dataValues.public_key;
  newMessage.createdAt = curDate;

  let stax_id;
  
  try {
    stax_id = await staxLib.addMessage(newMessage);
  } catch(err) {
    throw Boom.badImplementation('Stax gate error');
  }
  
  let dbMessage = {
    stax_id: stax_id,
    device_id: curDevice.dataValues.device_id
  };
  
  let newDbMessage = await messages.create(dbMessage);
  
  return {
    meta: {
      total: 0,
      count: 0,
      offset: 0,
      error: null
    },
    data: [ newDbMessage.dataValues ]
  };
}

const responseScheme = Joi.object({
  meta: responsSchemes.meta,
  data: Joi.array().items(Joi.object({
    id: Joi.number().integer().example(1),
    stax_id: Joi.string().example('qweqweqwe'),
    device_id: Joi.string().example('aa:bb:cc:ee'),
    createdAt: Joi.date().example(new Date()),
    updatedAt: Joi.date().example(new Date())
  }))
});

module.exports = {
  method: 'POST',
  path: '/messages',
  options: {
    handler: response,
    description: 'Add messages to the storage ',
    tags: ['api'],
    auth: false,
    validate: {
      payload: {
        device_id: Joi.string().required().example('aa:bb:cc:ee'),
        message: Joi.string().required().example('Lorem ipsum'),
        signature: Joi.string().required().example('aabbccdd')
      }
    },
    response: { schema: responseScheme } 
  }
};
 
