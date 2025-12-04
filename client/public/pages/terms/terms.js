const { component } = await use("@/component");
const { layout } = await use("@/layout/");
const { ref } = await use("@/state");
const { router, Nav, NavLink } = await use("@/router/");
const { marked } = await use("@/marked");

const page = component.main("container pt-3", component.h1({ text: "Terms" }));

const subPage = component.div("border border-top-0 rounded-bottom p-3", {
  "data.sub": true,
});

const content = {};

const state = ref();
state.effects.add(
  (current) => {
    if (current) {
      subPage.clear();
      const html = content[`/terms/${current}`];
      if (html) {
        subPage.insert.afterbegin(html);
      } else {
        /* If not built -> load from src and parse at runtime */
        const path = `/content/src/terms/${current}.md`;
        use(path)
          .then((text) => {
            const html = marked.parse(text);
            subPage.insert.afterbegin(html);
            content[`/terms/${current}`] = html;
          })
          .catch((error) => router.error(error));
      }
    } else {
      subPage.clear();
      subPage.append(
        component.p("text-neutral-400/50 text-lg", {}, "Select a topic...")
      );
    }
  },
  { run: false }
);

async function setup(base) {
  //const link = await use(`/pages${base.repeat(2)}.css`);

  console.log('base:', base)


  const link = await use(`/pages//terms.css`);

  page.data.base = base;
  const manifest = await use(`/content/meta/terms.json`);
  const paths = manifest.map(([path, timestamp]) => path);
  for (const path of paths) {
    content[path] = (await use(`/content/dst${path}.json`)).html;
  }

  Nav(
    component.nav(
      "nav nav-tabs pt-3",
      { parent: page },
      NavLink("nav-link.nav-item.active", {
        text: "Membership",
        path: `${base}/membership`,
        title: "Membership",
      }),
      NavLink("nav-link", {
        text: "Liability",
        path: `${base}/liability`,
        title: "Liability",
      }),
      NavLink("nav-link", { text: "IP", path: `${base}/ip`, title: "IP" })
    )
  );
  page.append(subPage);

  (() => {
    const state = ref();
    const group = component.div("btn-group", {
      parent: page,
      role: "group",
      "[aria-label]": "Toggle button group",
    });

    

    const label = component.label("btn btn-outline-primary", {
      parent: group,
      text: "No style",
    },
    component.input("btn-check", {
      //parent: group,
        type: "radio",
        name: "disabled",
      })
  
  
  
  );
  })();

  page.append(
    component.div(
      "btn-group",
      {
        role: "group",
        "on.change": (event) => {
          console.log("event:", event);

          if (true) {
            link.sheet.disabled = true;
          } else {
            link.sheet.disabled = false;
          }
        },
        "[aria-label]": "Toggle button group",
      },
      function () {
        const input = component.input("btn-check", {
          parent: this,
          type: "radio",
          name: "disabled",
        });

        input.id = input.uid;
        component.label(
          "btn btn-outline-primary",
          { parent: this, for_: input.id },
          "No style"
        );
      },
      function () {
        const input = component.input(
          "btn-check",
          { parent: this, type: "radio", name: "enabled" },
        );
        input.id = input.uid;
        component.label(
          "btn btn-outline-primary",
          { parent: this, for_: input.id },
          "Style"
        );
      }
    )
  );
}

function enter(meta, query, ...paths) {
  layout.clear(":not([slot])");
  layout.append(page);
  /* Default to null, since undefined state is ignored */
  state(paths.at(0) || null);
}

function update(meta, query, ...paths) {
  /* Default to null, since undefined state is ignored */
  state(paths.at(0) || null);
}

function exit(meta) {
  page.remove();
}

export { setup, enter, update, exit };
