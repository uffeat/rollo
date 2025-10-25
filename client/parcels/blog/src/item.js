export const ItemFactory = async (use) => {
  const { component } = await use("/component.js");
  await use("//content.js");
  const { toTop } = await use("/tools/scroll.js");

  const cache = new Map();

  /* Returns item component singleton that imports its own data and renders 
  itself asyncronously. */
  const factory = (path) => {
    /* Cache to avoid redundant content import and image loading */
    if (cache.has(path)) {
      return cache.get(path);
    }
    /* Prepare tree */
    const tree = {
      card: component.div("card.h-100"),
      /* Card header */
      cardImage: component.img("card-img-top"),
      cardPlaceholder: component.div(
        "placeholder-glow",
        component.span("placeholder.w-100")
      ),
      /* Card body */
      cardBody: component.div("card-body.nav.d-flex.flex-column"),
      cardLink: component.a("nav-link"),
      cardTitle: component.h1("card-title"),
      cardAbstract: component.p("card-text"),
      /* Card footer */
      cardFooter: component.div("card-footer"),
      /* Post */
      post: component.div("post.d-none"),
      postHeader: component.section("header"),
      postBack: component.button("btn.btn-primary", "Back"),
    };
    /* Build card */
    tree.cardLink.append(tree.cardTitle);
    tree.cardBody.append(tree.cardLink, tree.cardAbstract);
    tree.card.append(tree.cardBody, tree.cardFooter);
    /* Build post */
    tree.postHeader.append(tree.postBack);
    tree.post.append(tree.postHeader);
    /* Post view -> card view */
    tree.postBack.on.click = (event) => {
      tree.card.classes.remove("d-none");
      tree.post.classes.add("d-none");
    };
    /* Create item component */
    const item = component.div(tree.card, tree.post);
    item.attribute.path = path;
    item.attribute.blogItem = true;

    /* Renders components from data */
    const render = ({ meta, content }) => {
      /* Render card */
      const { image, title = "", abstract = "" } = meta;
      tree.cardTitle.text = title;
      tree.cardAbstract.text = abstract;
      if (image) {
        tree.card.prepend(tree.cardPlaceholder);

        tree.cardImage.src = image.startsWith("/")
          ? `${use.meta.base}${image}`
          : image;
        tree.cardImage.on.load = (event) => {
          tree.cardPlaceholder.replaceWith(tree.cardImage);
          item.attribute.ready = true;
          item.send("_ready");
        };
      } else {
        item.attribute.ready = true;
        item.send("_ready");
      }
      /* Render post */
      tree.post.insert.beforeend(content);
      /* Adjust image sources */
      for (const image of tree.post.querySelectorAll("img")) {
        /* Do not use src prop as this would localhost-prefix */
        const src = image.getAttribute("src");
        if (src.startsWith("/")) {
          image.src = `${use.meta.base}${src}`;
          /* Alternatively:
          const replacement = component.img({src: `${use.meta.base}${src}`})
          image.replaceWith(replacement)
          */
        }
      }
      /* Card view -> post view */
      tree.cardLink.on.click = (event) => {
        event.preventDefault();
        tree.card.classes.add("d-none");
        tree.post.classes.remove("d-none");
        toTop(tree.post);
      };
    };

    cache.set(path, item);

    /* Import content and render */
    use(`${path}.content`).then((data) => {
      render(data);
    });

    return item;
  };

  return factory;
};
