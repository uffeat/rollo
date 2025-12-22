/* 
/plotly/bar_lc.test.js
*/

const { app, component, delay, element, css, router, NavLink } = await use(
  "@/rollo/"
);
const { frame } = await use("@/frame/");

const route = new (class {
  #_ = {};

  constructor() {
    this.#_.page = component.div("plotly-wrapper container");
  }

  get page() {
    return this.#_.page;
  }

  async setup(base) {
    this.#_.data = [
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
    ];

    this.#_.layout = {
      font: { color: css.root.bsLight },
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
    };

    this.#_.config = {
      displaylogo: false,
    };

    this.#_.spinner = component.div(
      "w-full flex justify-center mt-24",
      {},
      component.div(
        "spinner-border.text-primary",
        { height: css.rem(8), width: css.rem(8), role: "status" },
        component.span("visually-hidden", "Loading...")
      )
    );

    this.#_.container = element.div();
    this.page.append(this.#_.container)
  }

  async enter(meta, url, ...paths) {
    frame.clear(":not([slot])");

    frame.append(this.page);
    this.page.classes.add("invisible");


    frame.append(this.#_.spinner);


    const { Plotly, colorway } = await use("@/plotly");
    if (!this.#_.layout.colorway) {
      this.#_.layout.colorway = colorway;
    }
   
    app.addEventListener("_resize_x", this.#_.onresize);


    app.on._resize_x = this.#_.onresize;
    Plotly.create(
      this.#_.container,
      this.#_.data,
      this.#_.layout,
      this.#_.config
    );
    this.#_.spinner.remove();
    
    
    Plotly.refresh(this.#_.container);
    /* Reduce initial plot flicker */
    setTimeout(() => {
      this.page.classes.remove("invisible");
    }, 0);
  }

  async exit(meta) {
    const { Plotly } = await use("@/plotly");
    
    Plotly.dispose(this.#_.container);
    this.page.remove();
    app.removeEventListener("_resize_x", this.#_.onresize);
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
