const { component } = await use("@/component");
const { layout } = await use("@/layout/");
const { ref } = await use("@/state");
const { router, Nav, NavLink } = await use("@/router/");

const page = component.main("container", component.h1({ text: "Terms" }));

const subPage = component.div({ "data.sub": true });
const content = {};

const state = ref();
state.effects.add(
  (current) => {
    //console.log("current:", current); ////

    if (current) {
      subPage.clear();
      const html = content[`/terms/${current}`];
      //console.log("html:", html); ////
      subPage.insert.afterbegin(html);
    } else {
      subPage.clear();
    }
  },
  { run: false }
);

async function setup(base) {
  console.log("base:", base); ////
  await use(`/pages${base.repeat(2)}.css`);

  page.data.base = base;

  const manifest = await use(`/content/meta/terms.json`);
  const paths = manifest.map(([path, timestamp]) => path);

  for (const path of paths) {
    content[path] = (await use(`/content/dst${path}.json`)).html;
  }

  //console.log("content:", content);////

  Nav(
    component.nav(
      "nav flex gap-x-1 p-1",
      { parent: page },

      NavLink("nav-link", {
        text: "Membership",
        path: `${base}/membership`,
        title: "Membership",
      }),
      NavLink("nav-link", { text: "IP", path: `${base}/ip`, title: "IP" })
    )
  );
  page.append(subPage)
}

function enter(meta, query, ...paths) {
  layout.clear(":not([slot])");
  layout.append(page);

  //console.log("paths:", paths);////
  /* Default to null, since undefined state is ignored */
  state(paths.at(0) || null);
}

function update(meta, query, ...paths) {
  //console.log("paths:", paths);////

  /* Default to null, since undefined state is ignored */
  state(paths.at(0) || null);
}

function exit(meta) {
  page.remove();
}

export { setup, enter, update, exit };
