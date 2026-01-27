import "../../../use";

import { Route } from "../../tools/route";

const { component } = await use("@/rollo/");

export default Route.create({
  page: component.main("container pt-3", component.h1({ text: "About" })),
});
