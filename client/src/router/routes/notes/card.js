const { component } = await use("@/rollo/");

export const Card = ({ path, abstract, image, title }) => {
  const card = component.div(
    "card",
    {},
    component.img("card-img-top", function () {
      this.src = image.startsWith("/") ? `${use.meta.base}${image}` : image;
      this.alt = `Illustration of ${title.toLowerCase()}`;
    }),
    component.div(
      "card-body.nav.d-flex.flex-column",
      {},
      component.a(
        "nav-link cursor-pointer hover:underline! hover:underline-offset-6! hover:decoration-2!",
        component.h1("card-title", { text: title, title })
      ),
      component.p("card-text", { text: abstract })
    ),
    component.div("card-footer min-h-8")
  );
  card.attribute.path = path;
  return card;
};
