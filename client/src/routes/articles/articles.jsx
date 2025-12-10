import { useEffect, useRef, useState } from "react";
import "@/use.js";

import { router } from "@/router/router.js";


import { Card } from "./card.jsx";

export const Articles = ({ root, cardsData, posts }) => {
  const wrapper = useRef();

  useEffect(() => {
    /* Prevent over-registration of effects (relevant for StrictMode) */
    if (root.detail.post) {
      return;
    }

    //console.log("posts:", posts);////

    root.$.effects.add(
      (change, message) => {
        //console.log("post:", change.post); ////
        if (change.post) {
          wrapper.current.classList.add("hidden");
          const post = posts[`/${change.post}`];
          //console.log("post:", post);////
          root.append(post);
        } else {
          const post = root.find(`[post]`);
          post?.remove();
          wrapper.current.classList.remove("hidden");
        }
      },
      ["post"]
    );

    root.detail.post = true;
  }, []);

  return (
    <div
      ref={wrapper}
      onClick={(event) => {
        const SELECTOR = ".card a.nav-link";
        //console.log('Clicked')////
        if (event.target.matches(SELECTOR) || event.target.closest(SELECTOR)) {
          const link = event.target.closest(SELECTOR);
          const path = link.getAttribute("path");
          router(`${root.attribute.page}${path}`);
        }
      }}
    >
      <h1 className="my-3">Articles</h1>
      <div
        className={`grid md:grid-cols-2 xl:grid-cols-3 gap-y-3  md:gap-4 xl:gap-5`}
      >
        {cardsData.map(([path, data]) => {
          console.log("Rendering card");////
          return <Card key={path} path={path} data={data} />;
        })}
      </div>
    </div>
  );
};
