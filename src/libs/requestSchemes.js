const Joi = require('joi');

const classicGetScheme = Joi.object({
  __order: Joi.string().default(''),
  __count: Joi.number().integer().min(1).max(100).default(20),
  __offset: Joi.number().integer().min(0).default(0)
});

module.exports = {
  classicGetScheme: classicGetScheme
}; 
