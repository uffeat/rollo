import { author } from "../../../src/tools/author.js";
import { mix } from "../../../src/tools/mix.js";
import { Mixins } from "../../../src/mixins/mixins.js";

export const WebComponent = author(
  class extends mix(HTMLElement, {}, ...Mixins()) {},
  "web-component"
);
