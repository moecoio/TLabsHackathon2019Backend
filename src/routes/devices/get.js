
const Joi = require('joi');

const responsSchemes = require('../../libs/responsSchemes');
const requestSchemes = require('../../libs/requestSchemes');
const queryHelper = require('../../libs/queryHelper');

async function response(request) {
  
  const devices = request.getModel(request.server.config.db.database, 'devices');
  let queryParams = queryHelper.parseQueryParams(request.query);
  
  let dbDevices = await devices.findAll(queryParams);
  
  let result = [];
  for(let item of dbDevices)
    result.push(item.dataValues);
  
  return {
    meta: {
      total: result.length,
      count: result.length,
      offset: request.query.offset || 0,
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
    public_key: Joi.string().example('qweqweqwqwqwr'),
    createdAt: Joi.date().example(new Date()),
    updatedAt: Joi.date().example(new Date()),
  }))
});

module.exports = {
  method: 'GET',
  path: '/devices',
  options: {
    handler: response,
    description: 'Get all devices list',
    tags: ['api'],
    validate: {
      query: requestSchemes.classicGetScheme
    },
    response: { schema: responseScheme } 
  }
}; 
