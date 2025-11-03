/*
ref/condition.js
*/
const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");

export default async ({ ref }) => {
  (() => {
    const state = ref(42);

    state.effects.add(
      (current, message) => {
        console.log("current:", current);
      },
      (current, message) => {
        return typeof current === "number";
      }
    );

    state(43);
    state(43);
    state("foo");
  })();
};
