/*
/tools/is/module.test.js
*/

import * as foo from './foo'

const { frame } = await use("@/frame/");
const { is } = await use("@/rollo/");

export default async () => {
  frame.clear(":not([slot])");

  const result = is.Module(foo)
  console.log('result:', result)


  
};
