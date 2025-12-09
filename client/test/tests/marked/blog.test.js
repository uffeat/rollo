/*
/marked/blog.test.js
*/

import "@/use.js";
import { component } from "component";
import { layout } from "@/layout/layout.js";
import { Sheet, css, rule, scope } from "@/sheet/sheet.js";
import { toTop } from "@/tools/scroll.js";

const { marked } = await use("@/marked");
const { YAML } = await use("@/yaml");


export default async () => {
  layout.clear(":not([slot])");

  const items = component.div({
    width: css.pct(100),
    ...css.display.flex,
    ...css.flexWrap.wrap,
    columnGap: css.rem(1),
    rowGap: css.rem(4),
  });

  const page = component.div("container.p-3", { parent: layout }, items);

  const Item = async (path) => {
    console.log("path:", path);

    const raw = await use(path);
    const parts = raw.trim().split("---");
    const meta = YAML.parse(parts[1]);
    console.log("meta:", meta);
    const md = parts.slice(2).join("");
    const html = marked.parse(md);

    const item = component.div("_item", {});

    const card = component.div(
      "card.h-100",
      {},
      component.img("card-img-top", { src: `${use.meta.base}${meta.image}` }),
      component.div(
        "card-body.nav.d-flex.flex-column",
        {},
        component.a(
          "nav-link",
          {
            cursor: "pointer",
            "@click": (event) => {
              event.preventDefault();
              const item = event.target.closest("._item");
              const post = item.querySelector("._post");
              const card = event.target.closest(".card");

              card.classes.add("d-none");
              post.classes.remove("d-none");

              toTop(post);
            },
          },
          component.h1("card-title", { text: meta.title })
        ),
        component.p("card-text", { text: meta.abstract })
      ),
      component.div("card-footer", { minHeight: css.rem(2) })
    );

    const post = component.div(
      "_post.d-none",
      { ...css.display.flex, ...css.flexDirection.column },
      component.button("btn.btn-primary", {
        text: "Back",
        justifySelf: "end",
        marginLeft: "auto",
        "@click": (event) => {
          const item = event.target.closest("._item");
          const post = event.target.closest("._post");
          const card = item.querySelector(".card");

          post.classes.add("d-none");
          card.classes.remove("d-none");
        },
      })
    );

    post.insert.beforeend(html);

    for (const image of post.querySelectorAll("img")) {
      image.replaceWith(
        component.img({
          src: `${use.meta.base}${image.getAttribute("src")}`,
          alt: image.alt,
        })
      );
    }

    item.append(card, post);

    return item;
  };

  const paths = ["/content/src/blog/sprocket.md", "/content/src/blog/bevel.md"];

  for (const path of paths) {
    Item(path).then((item) => items.append(item));
  }
};
