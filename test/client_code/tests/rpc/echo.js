/*
rpc/echo.js
*/

export default async () => {

  const response = await use('rpc/echo', {test: true}, {foo: 'FOO', things: [{first: 1}, {second: 2}]}, 1, 2, 3)
  console.log('response:', response)
  
};
