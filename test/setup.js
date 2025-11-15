const STORAGE_KEY = "__test__";

/* Returns async function that sets up testbench. */
export const setup = ({ prefix = "./tests/", report } = {}) => {
  return async (loaders, target) => {
    const { app } = await use("@//app.js");
    const { component } = await use("@/component.js");
    const { Module } = await use("@/tools/module.js");
    const { Sheet, css } = await use("@/sheet.js");
    const { extract } = await use("@/tools/html.js");

    const sheet = Sheet.create({
      "[rig]": {
        position: "absolute",
        top: css.pct(30),
        right: 0,

        backgroundColor: css.__.bsLight,
        zIndex: 300,
        margin: css.rem(1),
      },

      "[rig] select": {
        width: css.rem(16),
        margin: css.rem(1),
      },

      "[rig] button": {
        //background: `url("${use.meta.base}/icons/menu.svg") no-repeat center / 1em`
      },
    });

    sheet.use();

    const Tests = new (class Tests {
      #_ = {};

      constructor() {
        this.#_.tests = Object.fromEntries(
          Object.entries(loaders).map(([k, v]) => [k.slice(prefix.length), v])
        );

        const keys = Object.keys(this.tests);
        //console.log("keys:", keys);

        const rig = component.div(
          {
            parent: app,
          },
          component.button(
            "btn",
            {
              innerHTML: (update) => {
                use("/icons/menu.svg").then(update);
              },
            }
            /* Alternatively:
            function() {
              use("/icons/menu.svg").then((html) => this.innerHTML = html)
            }
            */
            /* Alternatively:
            component.img({ src: `${use.meta.base}/icons/menu.svg` }),
            */
          ),
          component.select(
            "form-select",
            { name: "tests", title: "tests" },
            component.option({ text: "Test" }),
            function () {
              keys.forEach((k) => {
                component.option({
                  value: k,
                  text: k,
                  parent: this,
                });
              });
            }
          )
        );
        rig.attribute.rig = true;

        //

        /* User change */
        rig.on.change = (event) => {
          //console.log('key:', `${event.target.value}`)
          this.run(`${event.target.value}`);
        };

        /* Initial */
        if (location.pathname) {
          //console.log('location.pathname:', location.pathname)
          const value = location.pathname.slice(1);

          const selected = rig.find(`option[value="${value}"]`);
          //console.log("selected:", selected);
          selected.selected = true;

          this.run(value);
        }

        /* User nav */
        window.addEventListener("popstate", (event) => {
          const value = location.pathname.slice(1);

          const previous = rig.find(`option[selected]`);
          if (previous) {
            previous.selected = false;
          }

          const current = rig.find(`option[value="${value}"]`);
          //console.log("current:", current);
          current.selected = true;

          this.run(value);
        });
      }

      get tests() {
        return this.#_.tests;
      }

      batch() {
        // TODO
      }

      async run(key) {
        updateUrl(`/${key}`);

        const load = this.tests[key];
        const loaded = await load();
        let test = loaded.default;
        if (key.endsWith(".html")) {
          const { assets, js } = extract(test);
          test = async (target, tests) =>
            (await Module.create(js, key)).default(target, assets, tests);
        }
        /* Run test and report */
        const result = await test(target, this);
        if (result !== undefined) {
          if (report) {
            report({ key, result });
          }
        }
      }
    })();

    window.addEventListener("keydown", async (event) => {
      /* Unit tests */
      if (event.code === "KeyU" && event.shiftKey) {
        const path = prompt("Path:", localStorage.getItem(STORAGE_KEY) || "");
        if (path) {
          localStorage.setItem(STORAGE_KEY, path);
          await Tests.run(path);
        }
      }
      /* Batch tests */
      if (event.code === "KeyT" && event.shiftKey) {
        Tests.batch();
      }
    });
  };
};

function updateUrl(url) {
  const previous = location.pathname;
  //console.log('previous:', previous)
  if (url === previous) {
    return;
  }
  history.pushState({}, "", url);
  //const current = location.pathname
  //console.log('current:', current)
  //console.dir(location)
}
