import "../use.js";
import "../assets/router.css";
import { router } from "./proxy.js";

export const Nav = (nav) => {
  router.effects.path.add(
    (path) => {
      const current = nav.find(`[path="${path}"]`);
      if (current) {
        const previous = nav.find(`[selected]`);
        if (previous) {
          previous.selected = false;
        }
        current.selected = true;
      }
    },
    (path) => !!path
  );
  return nav;
};
