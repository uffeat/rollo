import "../../use";
import { router } from "../router";

export const Nav = (nav) => {
  router.effects.add(
    (path) => {
      const previous = nav.find(`.active`);
      if (previous) {
        previous.classes.remove("active");
      }
      const current = nav.find(`[path="${path}"]`);
      if (current) {
        current.classes.add("active");
      }
    },
    (path) => !!path,
  );
  return nav;
};

