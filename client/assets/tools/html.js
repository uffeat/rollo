const { component } = await use("@/component.js");
const { Sheet } = await use("@/sheet.js");

export const extract = (html) => {
  const temp = component.div({ innerHTML: html });
  const assets = Object.freeze(
    Object.fromEntries([
      ...Array.from(temp.querySelectorAll(`style[name]`), (e) => [
        e.getAttribute("name"),
        Sheet.create(e.textContent.trim()),
      ]),
      ...Array.from(temp.querySelectorAll(`template[name]`), (e) => [
        e.getAttribute("name"),
        e.innerHTML.trim(),
      ]),
    ])
  );
  const js = temp.querySelector('script')?.textContent.trim()
  return Object.freeze({assets, js})

};
