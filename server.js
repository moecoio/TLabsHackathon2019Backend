#!/usr/bin/env node
'use strict';

const Hapi = require('hapi');
const filepaths = require('filepaths');
const Sequelize = require('sequelize');
const hapiBoomDecorators = require('hapi-boom-decorators');
const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');
const AuthBearer = require('hapi-auth-bearer-token');
const bearerValidation = require('./src/libs/bearerValidation');
const Logger = require('./src/libs/Logger');

const config = require('./config');
const Package = require('./package');

const swaggerOptions = {
  jsonPath: '/documentation.json',
  documentationPath: '/documentation',
  info: {
    title: Package.description,
    version: Package.version
  },
};

async function createServer(logLVL='info') {
  const server = await new Hapi.Server(config.server);
  const logger = new Logger(logLVL, 'Gate-Server-Betta');

  await server.register([
    AuthBearer,
    hapiBoomDecorators,
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    },
    {
      plugin: require('hapi-sequelizejs'),
      options: [
        {
          name: config.db.database, 
          models: [__dirname + '/src/models/*.js'],
          sequelize: new Sequelize(config.db),
          sync: true,
          forceSync: false,
        },
      ],
    }
  ]);
  
  server.auth.strategy('token', 'bearer-access-token', {
    allowQueryToken: false,
    unauthorized: bearerValidation.unauthorized,
    validate: bearerValidation.validate
  });

  let routes = filepaths.getSync(__dirname + '/src/routes/');
  for(let route of routes)
    server.route( require(route) );
  
  server.ext({
    type: 'onRequest',
    method: async function (request, h) {
      request.server.config = Object.assign({}, config);
      return h.continue;
    }
  });
  
  server.events.on('response', (request) => {
    logger.log('info', 'route', {
      method: request.route.method,
      url: request.url.href,
      statusCode: request.raw.res.statusCode,
      remoteAddr: request.headers[ 'x-real-ip' ],
      referrer: request.info.referrer
    });
  });
  
  process.on('unhandledRejection', (err) => {
    logger.log('error', 'app', JSON.stringify(err));
    // server have to crash on this error
    process.exit(1);
  });
  
  try {
    await server.start();
    logger.log('info', 'app', `Server running at: ${server.info.uri}`);
  } catch(err) {
    logger.log('error', 'app', JSON.stringify(err));
    // server have to crash on this error
    process.exit(1);
  }

  return server;
}

createServer();
