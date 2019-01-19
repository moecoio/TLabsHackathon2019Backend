// ./src/libs/bearerValidation.js

const Boom = require('boom');
const Op = require('sequelize').Op;

async function unauthorized () {
  throw Boom.unauthorized();
}

async function validate (request, token) {
  
  const accessToken = request.getModel(request.server.config.db.database, 'access_tokens');
  const users = request.getModel(request.server.config.db.database, 'users');
  
  let dbToken = await accessToken.findOne({ where: {
    token: token,
    expires_at: {
      [ Op.gte ]: new Date()
    }
  }
  });
  
  if( !dbToken ) {
    return {
      isValid: false,
      credentials: {}
    };
  }
  
  let curUser = await users.findOne({ where: { id: dbToken.dataValues.user_id } });
  
  if( !curUser ) {
    accessToken.destroy({ where: { user_id: dbToken.dataValues.user_id } });
    return {
      isValid: false,
      credentials: {}
    };
  }

  return {
    isValid: true,
    credentials: {
      role: 'admin'
    },
    artifacts: {
      token: token,
      user: curUser.dataValues
    }
  };
}

module.exports = {
  validate: validate,
  unauthorized: unauthorized
}; 
