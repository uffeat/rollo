/*
/router/assets.test.js

About
Tests injected '/assets' import engine source (meta test...)

*/

import "./assets.js";

export default async () => {
  const fooSheet = await use("assets/foo.css");
  console.log("fooSheet:", fooSheet);

  const xFoo = (await use("assets/foo.x.html"))();
  console.log("xFoo:", xFoo);
};
