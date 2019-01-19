
const Joi = require('joi');
const Boom = require('boom');

const responsSchemes = require('../../libs/responsSchemes');
const staxLib = require('../../libs/stax');

async function response(request) {
  
  const devices = request.getModel(request.server.config.db.database, 'devices');
  
  let dbDevice = await devices.findOne({ where: {device_id: request.params.device_id} });
  
  if( !dbDevice ) {
    throw Boom.notFound('Not found in hot cache');
  }
  
  let staxData;
  
  try {
    staxData = await staxLib.getPublicKey(dbDevice.dataValues.stax_id);
  } catch(err) {
    // not found
  }
  
  if( !staxData ) {
    throw Boom.notFound('Not found in blockchain');
  }
  
  console.log('dbDevice::', dbDevice.dataValues);
  
  return {
    meta: {
      total: 1,
      count: 1,
      offset: 0,
      error: null
    },
    data: [ dbDevice.dataValues ]
  };
}

const responseScheme = Joi.object({
  meta: responsSchemes.meta,
  data: Joi.array().items(Joi.object({
    id: Joi.number().integer().example(1),
    stax_id: Joi.string().example('qweqweqwe'),
    device_id: Joi.string().example('aa:bb:cc:ee'),
    public_key: Joi.string().example('qweqweqwqwqwr'),
    createdAt: Joi.date().example(new Date()),
    updatedAt: Joi.date().example(new Date()),
                                    
  }))
});

module.exports = {
  method: 'GET',
  path: '/devices/{device_id}',
  options: {
    handler: response,
    description: 'Get device by device_id',
    tags: ['api'],
    validate: {
      params: {
        device_id: Joi.string().required().example('asdqwerty')
      }
    },
    response: { schema: responseScheme } 
  }
}; 
