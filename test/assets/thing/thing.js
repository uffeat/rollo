const node = use.app.querySelector(`div[thing]`);


const container = node.querySelector(`div[anvil-slot="plot"]`);
const plot = container.querySelector(`.anvil-plot`);

const _resize_x = (event) => {
  const width = container.getBoundingClientRect().width;
  plot.style.width = `${width}px`;
};

app.addEventListener("_resize_x", _resize_x);

node.addEventListener("_disconnect", (event) => {
  app.removeEventListener("_resize_x", _resize_x);
});

//export const template = html`<h1>{{}}</h1>`;
//
//node.dispatchEvent(new Event("_disconnect"))
//



console.warn("Injected thing.js...");
