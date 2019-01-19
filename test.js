let staxLib = require('./src/libs/stax');


let testData = {'device_id': 'aa:bb:cc:ee', 'message': 'Hello world', 'signature': 'asdqwe', createdAt: new Date()};
let test_id = '2a7f5f2b84a252cce8e71b45fae6ac5eefe359fe1d3ba7b4f0aa0bdb3b4ade06';

async function test() {
  let result = await staxLib.getMessage(test_id);
  
  
  console.log('>>> ', result);
}

test();
