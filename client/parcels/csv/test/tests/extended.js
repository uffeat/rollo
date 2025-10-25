/*
extended.js
*/

export default async ({ CSV }) => {
  class Foo extends CSV.constructor {
    constructor() {
      super();
    }
  }

  const foo = new Foo();

  console.log("foo.Papa:", foo.Papa);
};
