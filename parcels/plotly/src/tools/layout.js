import "../../use";

const { css, freeze } = await use("@/rollo/");

/* Map trace colors to Bootstrap. */
const colorway = freeze([
  css.root.bsBlue,
  css.root.bsGreen,
  css.root.bsPink,
  css.root.bsIndigo,
  css.root.bsTeal,
  css.root.bsOrange,
  css.root.bsYellow,
]);

const bsLight = css.root.bsLight;

/* Returns axis-related object for use in layout.
NOTE Lean DX helper. */
const Axis = (text, options = {}) => {
  return { title: { text }, ...options };
};

/* Returns object with default layout fragment. */
const Layout = () => {
  return {
    colorway,
    font: { color: bsLight },
  };
};

export { Axis, Layout };
