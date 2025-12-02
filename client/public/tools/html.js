const { component } = await use("@/component");
const { Sheet } = await use("@/sheet");

export const extract = (html) => {
  const fragment = component.div({ innerHTML: html });

  const namedStyles = Object.freeze(
    Object.fromEntries(
      Array.from(fragment.querySelectorAll(`style[name]`), (e) => {
        return [e.getAttribute("name"), e];
      })
    )
  );

  const forStyles = Object.freeze(
    Object.fromEntries(
      Array.from(fragment.querySelectorAll(`style[for]`), (e) => {
        return [e.getAttribute("for"), e];
      })
    )
  );

  const namedTemplates = Object.freeze(
    Object.fromEntries(
      Array.from(fragment.querySelectorAll(`template`), (e) => {
        const name = e.hasAttribute("name")
          ? e.getAttribute("name")
          : "template";
        return [name, e];
      })
    )
  );

  const result = { forStyles, fragment, namedStyles, namedTemplates };

  const script = fragment.querySelector("script");
  if (script) {
    result.script = script;
  }

  return Object.freeze(result);
};
