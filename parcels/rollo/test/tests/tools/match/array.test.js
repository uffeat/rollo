/*
/tools/match/array.test.js
*/

const { frame } = await use("@/frame/");
const { match } = await use("@/rollo/");

export default async () => {
  frame.clear(":not([slot])");

  (() => {
    const target = [1, 2, 3]

    const other = [1, 2, 3]

    const result = match(target, other)
    console.log('result:', result)
   




  })();

  
};
