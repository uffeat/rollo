/*
/tools/match/basics.test.js
*/

const { frame } = await use("@/frame/");
const { match } = await use("@/rollo/");

export default async () => {
  frame.clear(":not([slot])");

  (() => {
    const target = {
      foo: { number: 42 },
      items: [1, 2, 3],
      ding: { dong: ["a", "b"] },
      stuff: undefined
    };

    const other = {
      foo: { number: 42 },
      items: [1, 2, 3],
      ding: { dong: ["a", "b"], things: undefined },
    };

    const actual = match(target, other)
    console.log(actual)
    const expected = true




  })();

  
};
