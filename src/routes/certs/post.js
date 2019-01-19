
const fs = require('fs');
const Joi = require('joi');
const execFile = require('child_process').execFile;

const responsSchemes = require('../../libs/responsSchemes');

function genCert(organisation, device_id, liveTime, tmpDir) {
  let subj = `/CN=${organisation}/UID=${device_id}/`;
  let fileName = getRandomString(16);
  
  let params = [ 'req', '-newkey' ,'rsa:2048' , '-nodes', '-keyout', `${tmpDir}/key_${fileName}.pem`, '-x509', '-days', liveTime, '-out', `${tmpDir}/cert_${fileName}.pem`, '-subj', subj ];

  return new Promise( function(resolve, reject) {
    execFile('openssl', params, function(error, stdout, stderr) {
      if( error )
        return reject(error);
      
      let cert = fs.readFileSync(`${tmpDir}/cert_${fileName}.pem`, { encoding: 'utf8' });
      let key = fs.readFileSync(`${tmpDir}/key_${fileName}.pem`, { encoding: 'utf8' });
      
      fs.unlinkSync(`${tmpDir}/cert_${fileName}.pem`)
      fs.unlinkSync(`${tmpDir}/key_${fileName}.pem`);
      
      resolve({
        pub_key: cert,
        priv_key: key
      });
    });    
  });  
}

function getRandomString(length) {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for( let i=0; i < length; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}

async function response(request) {
  
  let cert = await genCert(request.payload.organisation, request.payload.device_id, request.payload.liveTime, request.server.config.tmpDir);

  return {
    meta: {
      total: 1,
      count: 1,
      offset: 0,
      error: null
    },
    data: [ cert ]
  };
}

const responseScheme = Joi.object({
  meta: responsSchemes.meta,
  data: Joi.array().items(Joi.object({
    pub_key: Joi.string().example('dlfknskjdfbjk'),
    priv_key: Joi.string().example('qweqweqwe'),                                    
  }))
});

module.exports = {
  method: 'POST',
  path: '/certs',
  options: {
    handler: response,
    description: 'Generate cert',
    tags: ['api'],
    auth: false,
    validate: {
      payload: {
        device_id: Joi.string().required().example('aa:bb:cc:ee'),
        organisation: Joi.string().required().example('My organisation'),
        liveTime: Joi.number().integer().required().default(365).example(365)
      }
    },
    response: { schema: responseScheme } 
  }
};
 
