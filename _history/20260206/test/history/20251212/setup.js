const STORAGE_KEY = "__test__";

/* Returns async function that sets up testbench. */
export const setup = ({ prefix = "./tests/", report } = {}) => {
  return async (loaders, target) => {
    const { app } = await use("@//app.js");
    const { component } = await use("@/component.js");
    const { Module } = await use("@/tools/module.js");
    const { Sheet, css, rule } = await use("@/sheet.js");
    const { extract } = await use("@/tools/html.js");
    const { ref } = await use("@/state.js");

    const state = ref();

    const sheet = Sheet.create({
      ...rule().attrs({ rig: true })({
        ...css.position.absolute,
        top: css.pct(30),
        right: 0,
        backgroundColor: css.__.bsLightBgSubtle,
        width: css.rem(16),
        paddingRight: css.rem(0.5),
        transition: css("transform", css.ms(400), "ease-in-out"),
      }),

      ...rule().attrs({ rig: true, close: true })({
        transform: `translateX(${css.rem(16 - 2.4 + 0.5)})`,
      }),

      ...rule()
        .attrs({ rig: true })
        ._.button({
          __size: css.rem(2.2),
          padding: 0,
          width: css.__.size,
          height: css.__.size,
        }),

      ...rule().attrs({ rig: true })._.button._.svg({
        color: css.__.bsLight,
      }),

      ...rule()
        .attrs({ rig: true, close: true })
        ._.button({
          transform: css.rotate(css.turn(0.5)),
        }),
    });

    sheet.use();

    const Tests = new (class Tests {
      #_ = {};

      constructor() {
        this.#_.tests = Object.fromEntries(
          Object.entries(loaders).map(([k, v]) => [k.slice(prefix.length), v])
        );

        const keys = Object.keys(this.tests);

        /* Create rig component */
        const rig = component.div(
          "d-flex.align-items-center.rounded-start.z-3",
          { parent: app },
          component.button("btn.btn-outline-secondary.d-flex.justify-content-center.align-items-center", {
            innerHTML: (update) => {
              use("@/icons/chevron_right.svg").then(update);
            },
          }),
          component.select(
            "form-select.flex-grow-1.my-2",
            { name: "tests", title: "tests" },
            component.option({ text: "Test" }),
            /* Set options */
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
        /* For styling */
        rig.attribute.rig = true;

        rig.on.click = (event) => {
          if (
            event.target.tagName === "BUTTON" ||
            event.target.closest("button")
          ) {
            rig.attribute.close = !rig.attribute.close;
          }
        };

        //
        //rig.attribute.close = true

        //

        /** State updaters */

        /* User change -> state */
        rig.on.change = (event) => {
          state(event.target.value);
        };

        /* Initial url -> state */
        if (location.pathname) {
          const value = location.pathname.slice(1);
          state(value);
        }

        /** Effects */

        /* state -> run test */
        state.effects.add(
          (current) => {
            this.run(current);
          },
          (current) => !!current,
          { run: false }
        );

        /* state -> update url */
        state.effects.add(
          (current) => {
            history.pushState({}, "", `/${current}`);
          },
          (current) => !!current,
          { run: false }
        );

        /* state -> update rig option */
        state.effects.add(
          (current, message) => {
            /* Reset selected option */
            const previous = rig.find(`option[selected]`);
            if (previous) {
              previous.selected = false;
              previous.attribute.selected = false;
            }
            const selected = rig.find(`option[value="${current}"]`);
            if (selected) {
              selected.selected = true;
              selected.attribute.selected = true;
            }
          },
          (current) => !!current
        );

        /* User nav -> state */
        window.addEventListener("popstate", (event) => {
          const value = location.pathname.slice(1);
          state(value);
        });
      }

      get tests() {
        return this.#_.tests;
      }

      batch() {
        // TODO
      }

      async run(key) {
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
