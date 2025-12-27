/*
/tools/freeze/basics.test.js
*/

const { frame } = await use("@/frame/");
const { freeze } = await use("@/rollo/");

export default async () => {
  frame.clear(":not([slot])");

  (() => {
    const target = freeze({
      foo: 42,
    });
    try {
      target.foo = 43;
      console.warn("Failure! Not frozen...");
    } catch (error) {
      console.log("Success!");
    }
  })();

  (() => {
    const target = freeze({
      foo: { number: 42 },
    });
    try {
      target.foo.number = 43;
      console.warn("Failure! Not frozen...");
    } catch (error) {
      console.log("Success!");
    }
  })();

  (() => {
    const target = freeze({
      foo: [1, 2, 3],
    });
    try {
      target.foo.push(4);
      console.warn("Failure! Not frozen...");
    } catch (error) {
      console.log("Success!");
    }
  })();

  (() => {
    const target = new Map();
    target.set("foo", { number: 42 });
    freeze(target);

    try {
      const foo = target.get("foo");
      target.foo.number = 43;
      console.warn("Failure! Not frozen...");
    } catch (error) {
      console.log("Success!");
    }
  })();

  (() => {
    const target = new Set();
    target.add({ number: 42 });
    freeze(target);

    try {
      const foo = target.values()[0];
      target.foo.number = 43;
      console.warn("Failure! Not frozen...");
    } catch (error) {
      console.log("Success!");
    }
  })();
};
