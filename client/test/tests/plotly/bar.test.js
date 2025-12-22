/* 
/plotly/bar.test.js
*/

const { component, element, css, router, NavLink } = await use("@/rollo/");
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
    /* NOTE The '@/' import is synthetic: `/src/plotly/index.js` (imported in 
    `/src/main.js`) injects alias, not just for consistency, but also to carve out
    a place to do Plotly related stuff (such as loading plotly.css). Could of 
    course be done in `/public/plotly/plotly.js`, but that file is unwieldy
    and VS Code struggles to lint. */
    const { Plotly, colorway } = await use("@/plotly");

    /* Assign figure to #_, so that it can easily me moved to other route member. */
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
        responsive: true,
      },
    ];

    Plotly.create(this.#_.container, ...this.#_.figure);
    /*
    Alternatively (equivalent):
    Plotly.newPlot(this.#_.container, ...this.#_.figure).then(() => {
      requestAnimationFrame(() => Plotly.Plots.resize(this.#_.container));
    });
    */
  }

  async enter(meta, url, ...paths) {
    /* NOTE Create plot here and clean up in 'exit', if plot should follow 
    route lifecycle. */
    frame.clear(":not([slot])");
    frame.append(this.page);
  }

  async exit(meta) {
    /* NOTE Do this if plot is created in 'enter':
    const { Plotly } = await use("@/plotly");
    Plotly.purge(this.#_.container);
    */
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
