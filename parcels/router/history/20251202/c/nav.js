import "../use.js";
import "../assets/router.css";
import { router } from "./proxy.js";



export const Nav = (nav) => {
  router.effects.add(
    (url) => {
      



      const previous = nav.find(`.active`);
      if (previous) {
        previous.classes.remove('active');
      }




      const current = nav.find(`[path="${url}"]`);
      if (current) {
        current.classes.add('active');
      }
    },
    (url) => !!url
  );
  return nav;
};
