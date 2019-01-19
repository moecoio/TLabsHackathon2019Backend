 
const Joi = require('joi');
const responsSchemes = require('../../libs/responsSchemes');
const staxLib = require('../../libs/stax');
 
async function response(request) {
  
  const devices = request.getModel(request.server.config.db.database, 'devices');
  let curDate = new Date();
  
  let stax_id = await staxLib.addPublicKey(request.payload.device_id, request.payload.public_key, curDate);
  
  let newDevice = Object.assign({}, request.payload);
  newDevice.createdAt = curDate;
  newDevice.updatedAt = curDate;
  newDevice.stax_id = stax_id;
  
  let newDbRecord = await devices.create(newDevice);
  
  console.log('*** TEST', newDbRecord.dataValues);

  return {
    meta: {
      total: 0,
      count: 0,
      offset: 0,
      error: null
    },
    data: [ newDbRecord.dataValues ]
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
  method: 'POST',
  path: '/devices',
  options: {
    handler: response,
    description: 'Add device pubic key',
    tags: ['api'],
    auth: false,
    validate: {
      payload: {
        device_id: Joi.string().required().example('aa:bb:cc:ee'),
        public_key: Joi.string().required().example('qweqweqwqwqwr')
    }
    },
    response: { schema: responseScheme } 
  }
};
 
