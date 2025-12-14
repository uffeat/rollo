/*
src/routes/articles/articles.jsx
*/
import "@/use";
import { useEffect, useRef } from "react";
import { Card } from "./card.jsx";

const { router } = await use("@/rollo/");

const SELECTOR = ".card a.nav-link";

export const Articles = ({ root, cards, posts }) => {
  const wrapperRef = useRef();
 
  /* Toggles 'cards view'/'post view'. 
  HACK Since posts are web components it could be argued that this whole thing 
  should be done in `articles.js` - inside a callback that recieves wrapper
  (sent from useEffect)... But hey, here's I'm using React, so let's do as
  much React stuff as possible. */
  useEffect(() => {
    /* Prevent over-registration of effects (especially relevant for StrictMode) */
    if (root.detail.setup) {
      return;
    }
    const wrapper = wrapperRef.current;
    /* NOTE `root.$.post` is set in route lifecycle hooks */
    root.$.effects.add(
      (change, message) => {
        /* Remove any previous post
        NOTE Alt: Could get previous post from DOM search */
        const previous = message.owner.previous.post;
        if (previous) {
          posts[`/${previous}`]?.remove();
        }
        if (change.post) {
          /* Post view */
          const post = posts[`/${change.post}`];
          if (!post) {
            router.error(`Invalid path: /${change.post}.`);
          }
          wrapper.classList.add("hidden");
          root.append(post);
        } else {
          /* Cards view */
          wrapper.classList.remove("hidden");
        }
      },
      ["post"]
    );
    root.detail.setup = true;
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={
        "hidden" /* Start out hidden to avoid flash if first page-load is a post view */
      }
      onClick={(event) => {
        if (event.target.matches(SELECTOR) || event.target.closest(SELECTOR)) {
          const link = event.target.closest(SELECTOR);
          const path = link.getAttribute("path");
          /*'root' is nested directly inside the page web component (makes it 
          possible to add other web components to the page). As per convention, 
          'page' holds base path info, so grab if from there. */
          router(`${root.parent.attribute.page}${path}`);
        }
      }}
    >
      <h1 className="my-3">Articles</h1>
      {/* Create a nested cards container, so that only wrapper needs to deal with
      display/undisplay */}
      <div
        // Thank you Tailwind; sorry that I did not always give you the love you deserve :-)
        className={`grid md:grid-cols-2 xl:grid-cols-3 gap-y-3 md:gap-4 xl:gap-5`}
      >
        {cards.map(([path, data]) => {
          return <Card key={path} path={path} data={data} />;
        })}
      </div>
    </div>
  );
};
