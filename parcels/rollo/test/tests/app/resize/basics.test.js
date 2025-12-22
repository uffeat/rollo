/*
/app/resize/basics.test.js
*/

const { app, component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  //console.log("Number of effects:", app.$().effects.size);
  //
  app.on._resize((event) => {
    //console.log("X:", app.$.X);
    //console.log("Y:", app.$.Y);
  });

  app.on._resize_x((event) => {
    console.log("X:", event.detail);
  });

  app.on._resize_y((event) => {
    console.log("Y:", event.detail);
  });
};
