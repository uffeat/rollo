import "../../use";

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export const iframe = component.iframe({
  id: "iworker",
  name: "iworker",
  src: `${use.meta.server.origin}/iworker?origin=${location.origin}`,
  slot: "iworker",
  //__height: 0,
});

frame.append(iframe);
