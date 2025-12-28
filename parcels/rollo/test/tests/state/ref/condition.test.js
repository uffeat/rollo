/*
/state/ref/condition.test.js
*/

const { is, ref } = await use("@/rollo/");

export default async () => {
  (() => {
    const state = ref(42);

    state.effects.add(
      (current, message) => {
        console.log("current:", current);
      },
      (current, message) => {
        return is.number(current);
      }
    );

    state(43);
    state(43);
    state("foo");
  })();
};
