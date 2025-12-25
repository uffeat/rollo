/*
/tools/merge/extend.test.js
*/

const { frame } = await use("@/frame/");
const { match, merge } = await use("@/rollo/");

export default async () => {
  frame.clear(":not([slot])");

  const target = {
    items: [1, 2, 3],
    ding: { dong: ["a", "b"] },
  };

  const source = {
    items: [10, 30],
    ding: { dong: ["B", "C"] },
  };

  const expected = {
    items: [1, 2, 3, 10, 30],
    ding: { dong: ["a", "b", "B", "C"] },
  };

  const result = merge(target, source, (target, source) => {
    return [...target, ...source];
  });

  if (match(result, expected)) {
    console.log("Success!");
  } else {
    console.warn("Failed!");
    console.log("Actual:", result);
    console.log("Expected:", expected);
  }

  //console.log("JSON.stringify(result):", JSON.stringify(result));

  /*
 
  */
};
