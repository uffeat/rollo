import "../../use";

const { Nav,  component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export const nav = Nav(
  component.nav("nav router flex flex-col gap-y-1 p-1", {
    slot: "side",
    parent: frame,
  })
);
