const Joi = require('joi');

const metaSchema = Joi.object({
  total: Joi.number().integer().example(9),
  count: Joi.number().integer().example(1),
  offset: Joi.number().integer().example(0),
  error: Joi.any().example('null')
});


module.exports = {
  meta: metaSchema,
};
