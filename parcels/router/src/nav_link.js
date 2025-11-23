import "../assets/router.css";
import { router } from "./proxy.js";

const { Mixins, author, component, mix } = await use("@/component.js");
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
            await router(this.path);
        }
      };
    }

    get path() {
      return this.attribute.path;
    }

    set path(path) {
      this.attribute.path = path;
    }
  },
  "nav-link",
  TAG
);
