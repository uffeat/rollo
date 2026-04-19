/*
front/front.js
*/

const { app, component, css } = await use("@/rollo/");
const { Iframe } = await use("assets/tools/iframe", { test: true });

const main = document.getElementById("main");
const frame = document.getElementById("frame");

export default async (state) => {
  //frame.clear(":not([slot])");

  const iframe = Iframe({ name: "front", src: `${origin}/front` });

  frame.append(iframe);


  //
  //
  //iframe.remove()
  
};
