/*
ref/basics.js
*/
const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");

const STYLE = "color: green; font: bold 1em 'JetBrains Mono';";

export default async ({ Ref, ref }) => {
  (() => {
    console.group("Ref");
    const state = Ref.create(42, (current, message) => {
      console.groupCollapsed("Inside effect");
      console.log("%ccurrent:", STYLE, current);
      for (const [key, value] of Object.entries(message).filter(
        ([key, value]) => !["effect"].includes(key)
      )) {
        console.log(`${key}:`, value);
      }
      console.groupEnd();
    });
    console.log("%ccurrent:", STYLE, state.current);
    console.groupEnd();
  })();

  (() => {
    console.group("ref");
    const state = ref(42, (current, message) => {
      console.groupCollapsed("Inside effect");
      console.log("%ccurrent:", STYLE, current);
      for (const [key, value] of Object.entries(message).filter(
        ([key, value]) => !["effect"].includes(key)
      )) {
        console.log(`${key}:`, value);
      }
      console.groupEnd();
    });
    console.log("%ccurrent:", STYLE, state());
    console.groupEnd();
    state(43);
  })();
};
