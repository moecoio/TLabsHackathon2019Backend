
const Joi = require('joi');
const Boom = require('boom');

const requestSchemes = require('../../libs/requestSchemes');
const queryHelper = require('../../libs/queryHelper');
const responsSchemes = require('../../libs/responsSchemes');
const staxLib = require('../../libs/stax');

async function response(request) {
  
  const devices = request.getModel(request.server.config.db.database, 'devices');
  const messages = request.getModel(request.server.config.db.database, 'messages');
  
  let dbDevice = await devices.findOne({ where: {device_id: request.params.device_id} });
  
  if( !dbDevice ) {
    throw Boom.notFound('Device not found in hot cache');
  }
  
  let staxData;
  
  try {
    staxData = await staxLib.getPublicKey(dbDevice.dataValues.stax_id);
  } catch(err) {
    // not found
  }
  
  if( !staxData ) {
    throw Boom.notFound('Device not found in blockchain');
  }
  
  let queryParams = queryHelper.parseQueryParams(request.query);
  let curMessages = messages.findAll();
  
  let result = [];
  for(let item of curMessages)
    result.push(item.dataValues);
  
  console.log('result::', result);
  
  return {
    meta: {
      total: 1,
      count: 1,
      offset: 0,
      error: null
    },
    data: result
  };
}

const responseScheme = Joi.object({
  meta: responsSchemes.meta,
  data: Joi.array().items(Joi.object({
    id: Joi.number().integer().example(1),
    stax_id: Joi.string().example('qweqweqwe'),
    device_id: Joi.string().example('aa:bb:cc:ee'),
    createdAt: Joi.date().example(new Date()),
    updatedAt: Joi.date().example(new Date()),
                                    
  }))
});

module.exports = {
  method: 'GET',
  path: '/devices/{device_id}/messages',
  options: {
    handler: response,
    description: 'Get messages by device_id',
    tags: ['api'],
    validate: {
      params: {
        device_id: Joi.string().required().example('asdqwerty')
      },
      query: requestSchemes.classicGetScheme
    },
    response: { schema: responseScheme } 
  }
}; 
