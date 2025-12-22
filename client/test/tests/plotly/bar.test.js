/* 
/plotly/bar.test.js
*/

const { app, component, delay, element, css, router, NavLink } = await use(
  "@/rollo/"
);
const { frame } = await use("@/frame/");

const route = new (class {
  #_ = {};

  constructor() {
    this.#_.container = element.div();
    this.#_.page = component.div("plotly-wrapper container", this.#_.container);
  }

  get page() {
    return this.#_.page;
  }

  async setup(base) {
    const { promise, resolve, reject } = Promise.withResolvers();
    this.#_.loading = promise;
    use("@/plotly")
      .then(({ Plotly, colorway }) => {
        this.#_.figure = [
          [
            {
              x: ["Zebras", "Lions", "Pelicans"],
              y: [90, 40, 60],
              type: "bar",
              name: "New York Zoo",
            },
            {
              x: ["Zebras", "Lions", "Pelicans"],
              y: [10, 80, 45],
              type: "bar",
              name: "San Francisco Zoo",
            },
          ],
          {
            font: { color: css.root.bsLight },
            colorway,
            xaxis: {
              title: {
                text: "Animal",
                font: {
                  size: 14,
                },
              },
            },
            yaxis: {
              title: {
                text: "Population",
                font: {
                  size: 14,
                },
              },
            },
            legend: {
              font: {
                size: 12,
              },
            },
          },
          {
            displaylogo: false,
          },
        ];

        Plotly.create(this.#_.container, ...this.#_.figure);
        /* Modern and efficient alternative to `responsive: true` in config */
        app.on._resize_x((event) => Plotly.refresh(this.#_.container));
        resolve(true);
        this.#_.loading = null;
      })
      .catch((error) => {
        //this.#_.loading = null;
        reject(error);
      });
  }

  async enter(meta, url, ...paths) {
    frame.clear(":not([slot])");
    if (this.#_.loading) {
      const spinner = component.div(
        "w-full flex justify-center mt-24",
        {},
        component.div(
          "spinner-border.text-primary",
          { height: css.rem(8), width: css.rem(8), role: "status" },
          component.span("visually-hidden", "Loading...")
        )
      );
      frame.append(spinner);
      await this.#_.loading;
      spinner.remove();
    }
    frame.append(this.page);
  }

  async exit(meta) {
    this.page.remove();
  }
})();

export default () => {
  router.routes.add(`/plotly`, route);
  const link = NavLink("nav-link", {
    text: "Plotly",
    path: `/plotly`,
    title: "Plotly",
    slot: "side",
  });
  /* Inject link into existing nav group to exploit active state management. */
  const nav = frame.find(`.nav[slot="side"]`);
  nav.append(link);
};
