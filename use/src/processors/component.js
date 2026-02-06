/* Adds support for conversion of html to component or array of components. */
import { use } from "../use";

use.processors.add(
  "html",
  "template",
  async (text, { options, owner, path }) => {
    // Options guard
    if (!options.convert) return;
    // Type guard
    if (!(typeof text === "string")) return;
    const { component } = await use("@/rollo/");
    return component.from(text);
  },
);
