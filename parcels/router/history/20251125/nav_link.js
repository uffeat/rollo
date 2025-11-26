import "../use.js";
import "../assets/router.css";
import { Query } from "./query.js";
import { router } from "./proxy.js";

const { Mixins, author, mix } = await use("@/component.js");
const { stateMixin } = await use("@/state.js");

const TAG = "a";

export const NavLink = author(
  class extends mix(
    document.createElement(TAG).constructor,
    {},
    ...Mixins(stateMixin)
  ) {
    #_ = {};
    constructor() {
      super();
      this.classes.add("nav-link");
      this.attribute.webComponent = true;

      this.on.click = async (event) => {
        if (this.path) {
          event.preventDefault();
          const nav = this.closest(".nav");
          if (nav) {
            for (const element of nav.querySelectorAll("a.nav-link")) {
              element.classList.remove("active");
            }
          }
          this.classes.add("active");
          const specifier = this.#_.query ? this.path + Query.stringify(this.#_.query) : this.path
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
  },
  "nav-link",
  TAG
);
