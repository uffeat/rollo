import { author } from "../tools/author.js";
import { mix } from "../tools/mix.js";
import { mixins } from "../mixins/mixins.js";

const _mixins = Object.entries(mixins)
  .filter(([k, v]) => !["for_", "novalidation"].includes(k))
  .map(([k, v]) => v);

export const WebComponent = author(
  class extends mix(HTMLElement, {}, ..._mixins) {},
  "x-component"
);
