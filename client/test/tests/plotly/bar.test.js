/* 
/plotly/bar.test.js
*/
import { plotly, colorway } from "@/plotly";

const { app, component, element, css, router, NavLink } = await use(
  "@/rollo/"
);
const { frame } = await use("@/frame/");

const route = new (class {
  #_ = {};

  constructor() {
    this.#_.container = element.div();
    this.#_.page = component.div("plotly-wrapper container", this.#_.container);

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
  }

  get page() {
    return this.#_.page;
  }

  async setup(base) {
    plotly.create(this.#_.container, ...this.#_.figure);
    /* Modern and efficient alternative to `responsive: true` in config */
    app.on._resize_x((event) => plotly.refresh(this.#_.container));
  }

  async enter(meta, url, ...paths) {
    frame.clear(":not([slot])");
    
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
