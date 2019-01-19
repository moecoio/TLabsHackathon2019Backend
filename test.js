let staxLib = require('./src/libs/stax');


async function test() {
  let result = await staxLib.addPublicKey('aa:bb:cc', 'asdasd-asdasd', new Date())
  
  
  console.log('>>> ', result);
}

test();
