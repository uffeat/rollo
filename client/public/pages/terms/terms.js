const { component } = await use("@/component");
const { layout } = await use("@/layout/");
const { ref } = await use("@/state");
const { router, Nav, NavLink } = await use("@/router/");
const { marked } = await use("@/marked");

const page = component.main("container pt-3", component.h1({ text: "Terms" }));

const subPage = component.div("border border-top-0 rounded-bottom p-3", {});
subPage.attribute.subPage = true;

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
  const link = await use(`/pages//${base.slice(1)}.css`);

  page.attribute.basePath = base;

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
    const group = component.div(
      "btn-group",
      {
        parent: page,
        role: "group",
      },

      function () {
        const radio = component.input("btn-check", {
          parent: this,
          name: "style",
          type: "radio",
          value: "styled",
          _value: false,

          checked: true
        });
        radio.id = radio.uid;
        component.label("btn btn-outline-primary", {
          parent: this,
          text: "Style",
          for_: radio.id,
        });
      },

      function () {
        const radio = component.input("btn-check", {
          parent: this,
          name: "style",
          type: "radio",
          value: "unstyled",
          _value: true,
        });
        radio.id = radio.uid;
        component.label("btn btn-outline-primary", {
          parent: this,
          text: "No style",
          for_: radio.id,
        });
      },

      
    );

    group.on.change((event) => {
      if ("_value" in event.target) {
        group.$.value = event.target._value;
      }
    });

    group.$.effects.add(
      (change) => {
        const value = change.value;
        link.sheet.disabled = value;
      },
      { run: false },
      ["value"]
    );

    //const styled = group.find("input:first-of-type")
    //const value = styled._value;
    //group.$.value = value;
  })();
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
