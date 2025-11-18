/*
ref/proxy.js
*/
const { component } = await use("@/component.js");
const { layout } = await use("@/layout/");

const STYLE = "color: green; font: bold 1em 'JetBrains Mono';";

export default async ({ ref }) => {
  const state = ref(42, (current, message) => {
    console.groupCollapsed("Inside effect");

    //console.log(`message:`, message); ////
    //console.log(`session:`, message.owner.session); ////

    const getterNames = Object.entries(
      Object.getOwnPropertyDescriptors(message.constructor.prototype)
    ).filter(([name, spec]) => spec.get).map(([name, spec]) => name)

    

    console.log("%ccurrent:", STYLE, current);
    for (const name of getterNames) {
      console.log(`${name}:`, message[name]);
    }

    console.groupEnd();
  });
  console.log("%ccurrent:", STYLE, state());

  //state(43);
};
