import "../use.js";
import "../assets/router.css";
import { router } from "./proxy.js";

export const Nav = (nav) => {
  router.effects.add(
    (path) => {
      const previous = nav.find(`[selected]`);
      if (previous) {
        previous.selected = false;
      }
      const current = nav.find(`[path="${path}"]`);
      if (current) {
        current.selected = true;
      }
    },
    (path) => !!path
  );
  return nav;
};
