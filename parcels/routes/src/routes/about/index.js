import "../../../use";

const { Route } = await use("@/router/");
const { component } = await use("@/rollo/");

const path = "/about";
const page = component.main("container pt-3", component.h1({ text: "About" }));
function enter() {
  frame.clear(":not([slot])");
  frame.append(this.page);
}
const route = Route.create({ enter, page, path });

export {route as default}
