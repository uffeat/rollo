import "../../use";

import { Route } from "../tools/route";

const { component } = await use("@/rollo/");
const { router } = await use("@/router/");
const { frame } = await use("@/frame/");

const route = Route.create({
  page: component.main("container pt-3", component.h1({ text: "Home" })),
  path: "/",
  text: "Home",
});

router.routes.add(route.path, route);

route.link.update({
  innerHTML: await use("/favicon.svg"),
  slot: "home",
  parent: frame,
});
