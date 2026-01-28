import "../../use";
import { nav } from "../tools/nav";

const { component } = await use("@/rollo/");
const { router, Route, NavLink } = await use("@/router/");
const { frame } = await use("@/frame/");

const path = "/";
const page = component.main("container pt-3", component.h1({ text: "Home" }));
function enter() {
  frame.clear(":not([slot])");
  frame.append(this.page);
}
/* Add route */
const route = Route.create({ enter, page, path });
router.routes.add(path, route);
/* Add nav link */
NavLink("nav-link", {
  path,
  innerHTML: await use("/favicon.svg"),
  slot: "home",
  parent: frame,
});
