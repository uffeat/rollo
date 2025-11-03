/*
ref/object.js
*/
const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");

export default async ({ ref }) => {
  (() => {
    const state = ref({ flag: true, score: 42 });

    state.effects.add((current, message) => {
      console.log("current:", current);
    });

    state({ score: 42, flag: true });
    state({ flag: true, score: 42 });
  })();
};
