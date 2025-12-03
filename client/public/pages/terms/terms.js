const { component } = await use("@/component");
const { layout } = await use("@/layout/");
const { ref } = await use("@/state");
const { router, Nav, NavLink } = await use("@/router/");

const page = component.main("container", component.h1({ text: "Terms" }));

async function setup(stem) {
  const { marked } = await use("@/marked");

  const manifest = await use(`/content/meta/terms.json`);
  //console.log('manifest:', manifest)

  const paths = manifest.map(([path, timestamp]) => path);
  //console.log("paths:", paths);////

  const foo = await use(`/content/built/blog/bevel.json`)

  const content = {};
  for (const path of paths) {

    console.log("path:", path);////


    content[path] =(await use(`/content/built${path}.json`)).html;

   
  }

  console.log("content:", content);

  Nav(
    component.nav(
      "nav flex gap-x-1 p-1",
      { parent: page },
      NavLink("nav-link", {
        text: "Membership",
        path: `${stem}/membership`,
        title: "Membership",
      }),
      NavLink("nav-link", { text: "IP", path: `${stem}/ip`, title: "IP" })
    )
  );
}

function enter(meta, query, ...paths) {
  layout.clear(":not([slot])");
  layout.append(page);
}

function update(meta, query, ...paths) {
  console.log("paths:", paths);
}

function exit(meta) {
  page.remove();
}

export { setup, enter, update, exit };
