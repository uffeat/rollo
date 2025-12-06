import "../../use.js";

const { component } = await use("@/component");

/* */
export default ({ path, ...meta }) => {
    const { abstract, image, title } = meta;

    const card = component.div(
      "card",
      {},
      component.img("card-img-top", { src: `${use.meta.base}${image}` }),
      component.div(
        "card-body.nav.d-flex.flex-column",
        {},
        component.a(
          "nav-link",
          component.h1("card-title", { text: title, title })
        ),
        component.p("card-text", { text: abstract })
      ),
      component.div("card-footer")
    );
    card.attribute.card = path;

    return card;
  };
