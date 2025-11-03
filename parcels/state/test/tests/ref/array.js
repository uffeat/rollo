/*
ref/array.js
*/
const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");

export default async ({ ref }) => {
  (() => {
    const state = ref([1, 2, 3]);

    state.effects.add((current, message) => {
      console.log("current:", current);
    });

    state([1, 2, 3]);
    state([1, 2, 3]);
  })();
};
