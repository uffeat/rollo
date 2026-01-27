import "../../use";
import { router } from "../router";
import { Query } from "../tools/query";

const { Mixins, author, mix, stateMixin, registry } = await use("@/rollo/");


console.log("registry:", registry); ////

console.log("About to register NavLink"); ////

const TAG = "a";
export const NavLink = author(
  class extends mix(
    document.createElement(TAG).constructor,
    {},
    ...Mixins(stateMixin),
  ) {
    #_ = {};
    constructor() {
      super();
      this.attribute.webComponent = true;
      this.attribute[this.constructor.__key__] = true;

      this.on.click = async (event) => {
        if (this.path) {
          event.preventDefault();
          const specifier = this.#_.query
            ? this.path + Query.stringify(this.#_.query)
            : this.path;
          await router(specifier);
        }
      };
    }

    get path() {
      return this.attribute.path;
    }

    set path(path) {
      this.attribute.path = path;
    }

    get query() {
      if (this.#_.query) {
        return Object.freeze({ ...this.#_.query });
      }
    }

    set query(query) {
      this.#_.query = query;
    }

    get selected() {
      return this.attribute.selected || false;
    }

    set selected(selected) {
      this.attribute.selected = selected;
    }
  },
  "nav-link",
  TAG,
);
