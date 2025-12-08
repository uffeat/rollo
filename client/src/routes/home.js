import { component } from "component";
import { layout } from "@/layout/layout.js";

const page = component.main("container pt-3", component.h1({ text: "Home" }));

export function enter(meta, url, ...paths) {
  layout.clear(":not([slot])");
  layout.append(page);
}

export function exit(meta) {
  page.remove();
}
