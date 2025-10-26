import { author } from "../tools/author.js";
import { factory } from "../tools/factory.js";
import { mix } from "../tools/mix.js";
import { mixins } from "../mixins/mixins.js";
import { registry } from "../tools/registry.js";

const _mixins = Object.entries(mixins)
  .filter(([k, v]) => !["for_", "novalidation"].includes(k))
  .map(([k, v]) => v);


const cls = class extends mix(HTMLElement, {}, ..._mixins) {}

if (!registry.has("x-component")) {
  registry.add(cls, "x-component")
}

export const WebComponent = factory(cls);
