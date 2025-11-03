/*
basics.js
*/
const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");

export default async ({ Ref, ref }) => {
  (() => {
    const state = Ref.create(
      42,
      (current, { detail, effect, index, owner, session }) => {
        console.log("effect got current:", current);
        console.log("effect got detail:", detail);
        console.log("effect got effect:", effect);
        console.log("effect got index:", index);
        console.log("effect got owner:", owner);
        console.log("effect got session:", session);
      }
    );
    console.log("state.current:", state.current);
  })();

  (() => {
    const state = ref(
      42,
      (current, { detail, effect, index, owner, session }) => {
        console.log("effect got current:", current);
        console.log("effect got detail:", detail);
        console.log("effect got effect:", effect);
        console.log("effect got index:", index);
        console.log("effect got owner:", owner);
        console.log("effect got session:", session);
      }
    );
    console.log("state.current:", state.current);
  })();
};
