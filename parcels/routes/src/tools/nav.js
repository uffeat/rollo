import "../../use";

const { component } = await use("@/rollo/");
const { Nav } = await use("@/router/");
const { frame } = await use("@/frame/");

export const nav = Nav(
  component.nav("nav router flex flex-col gap-y-1 p-1", {
    slot: "side",
    parent: frame,
  })
);
