/* 
/plotly/bar.test.js
*/
import { Plot } from "@/plotly";

const { app, component, element, css, router, NavLink } = await use("@/rollo/");
const { frame } = await use("@/frame/");

const route = new (class {
  #_ = {};

  constructor() {
    const x = ["Zebras", "Lions", "Pelicans"];
    const type = "bar";
    const buttonStyle = "btn.btn-primary";

    const plot = Plot({
      data: [
        {
          x,
          y: [90, 40, 60],
          type,
          name: "New York",
        },
        {
          x,
          y: [10, 80, 45],
          type,
          name: "San Francisco",
        },
      ],
      layout: {
        xaxis: {
          title: {
            text: "Animal",
          },
        },
        yaxis: {
          title: {
            text: "Population",
          },
        },
      },
    });

    this.#_.page = component.main(
      "container pt-3",
      component.h1({ text: "Bar plot" }),
      component.menu(
        "flex justify-end flex-wrap gap-3 me-3",
        component.button(
          buttonStyle,
          {
            "on.click": (event) => {
              plot.update({
                layout: {
                  xaxis: {
                    title: {
                      text: "Inhabitant",
                    },
                  },
                  yaxis: {
                    title: {
                      text: "Number",
                    },
                  },
                },
              });
            },
          },
          "Update layout"
        ),
        component.button(
          buttonStyle,
          {
            "on.click": (event) => {
              plot.traces.append({
                x,
                y: [10, 20, 40],
                type,
                name: "Copenhagen",
              });
            },
          },
          "Append Copenhagen"
        ),
        component.button(
          buttonStyle,
          {
            "on.click": (event) => {
              plot.traces.update(0, { y: [60, 90, 60] });
            },
          },
          "Change New York"
        ),
        component.button(
          buttonStyle,
          {
            "on.click": (event) => {
              plot.traces.remove(1);
            },
          },
          "Remove San Francisco"
        ),
        component.button(
          buttonStyle,
          {
            "on.click": (event) => {
              plot.traces.change(0, { y: [40, 40, 40] });
              console.log('plot.data:', plot.data)
            },
          },
          "Change first"
        ),
        component.button(
          buttonStyle,
          {
            "on.click": (event) => {
              const index = plot.traces.index('Copenhagen');
              console.log('index:', index)
            },
          },
          "Find Copenhagen index"
        ),
      ),
      plot
    );
  }

  get page() {
    return this.#_.page;
  }

  async setup(base) {}

  async enter(meta, url, ...paths) {
    frame.clear(":not([slot])");
    frame.append(this.page);
  }

  async exit(meta) {
    this.page.remove();
  }
})();

export default () => {
  /* Add route */
  router.routes.add(`/plotly-bar`, route);
  const link = NavLink("nav-link", {
    text: "Plotly bar plot",
    path: `/plotly-bar`,
    title: "Plotly bar plot",
    slot: "side",
  });
  /* Inject link into existing nav group to exploit active state management. */
  const nav = frame.find(`.nav[slot="side"]`);
  nav.append(link);
};
