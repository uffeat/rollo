const { component } = await use("@/component");
const { Sheet } = await use("@/sheet");

export const extract = (html) => {
  const fragment = component.div({ innerHTML: html });
  const assets = Object.freeze(
    Object.fromEntries([
      ...Array.from(fragment.querySelectorAll(`style`), (e) => {
        const sheet = Sheet.create(e.textContent.trim());
        //
        //
        if (e.hasAttribute("global")) {
          sheet.use();
        }
        //
        //
        const name = e.hasAttribute("name") ? e.getAttribute("name") : "sheet";
        return [name, sheet];
      }),
      ...Array.from(fragment.querySelectorAll(`template[name]`), (e) => [
        e.getAttribute("name"),
        e.innerHTML.trim(),
      ]),
    ])
  );

  const result = { assets, fragment };

  const script = fragment.querySelector("script");
  if (script) {
    result.js = script.textContent.trim();
  }

  return Object.freeze(result);
};
