/*
/breakpoints.test.js
*/
const { component } = await use("@/component");
const { layout } = await use("@/layout/");
const { Sheet, css } = await use("@/sheet");
const { Plotly } = await use("@/plotly");
const { app } = await use("@/app/");

const sheet = Sheet.create({
  ".plotly .modebar": {
    backgroundColor: css.important("pink"),

    boxShadow: css.important(null),
  },
});

sheet.use();

export default async ({ breakpoints }) => {
  layout.clear(":not([slot])");
  layout.close();

 
  app.on._break_sm({ run: true }, (event) => {
    console.log("sm satisfied:", event.detail ?? app.$.sm);
  });

  

  const plotContainer = document.createElement("div");

  plotContainer.style.border = `2px solid ${css.__.bsGray400}`;

  plotContainer.style.alignSelf = "stretch";

  Plotly.newPlot(
    plotContainer,
    /* data */
    [
      {
        x: [576],
        y: [""],
        type: "bar",
        orientation: "h",
        marker: {
          color: css.__.bsGray400,
        },
      },
    ],
    /* layout */
    {
      height: 500,
      margin: {
        l: 50,
        r: 50,
        b: 100,
        t: 100,
        pad: 4,
      },
      paper_bgcolor: "rgba(0,0,0,0)", // transparent outside background
      plot_bgcolor: "rgba(0,0,0,0)", // transparent plot area
      font: { color: "white" }, // make all text white
      xaxis: {
        range: [0, 1600],
        color: "white", // axis lines + ticks
        gridcolor: "rgba(255,255,255,0.2)", // subtle grid (optional)
      },
      yaxis: {
        color: "white",
      },
    },
    /* config */
    {
      displaylogo: false,
      responsive: true,
    }
  );

  app.effects.add(
    (change, message) => {
      //console.log("state:", app.state);
      const current = app.state.current;
      if (current.xxl) {
        Plotly.restyle(plotContainer, "x", [[breakpoints.xxl]]);
        Plotly.restyle(plotContainer, "marker.color", [css.__.bsBlue]);
        return;
      }
      if (current.xl) {
        Plotly.restyle(plotContainer, "x", [[breakpoints.xl]]);
        Plotly.restyle(plotContainer, "marker.color", [css.__.bsPurple]);
        return;
      }
      if (current.lg) {
        Plotly.restyle(plotContainer, "x", [[breakpoints.lg]]);
        Plotly.restyle(plotContainer, "marker.color", [css.__.bsYellow]);
        return;
      }

      if (current.md) {
        Plotly.restyle(plotContainer, "x", [[breakpoints.md]]);
        Plotly.restyle(plotContainer, "marker.color", [css.__.bsOrange]);
        return;
      }

      if (current.sm) {
        Plotly.restyle(plotContainer, "x", [[breakpoints.sm]]);
        Plotly.restyle(plotContainer, "marker.color", [css.__.bsRed]);
        return;
      }

      Plotly.restyle(plotContainer, "marker.color", [css.__.bsGray400]);
    },
    ["sm", "md", "lg", "xl", "xxl"]
  );

  const container = component.div(
    "container",
    {
      parent: layout,
      ...css.display.flex,
      ...css.flexDirection.column,
      ...css.alignItems.end,
      margin: css.rem(1),

      border: "2px solid green",
    },
    component.h2({
      text: "XS",
      color: css.__.bsLight,
    })
  );

  const defaults = {
    parent: container,
  };

  [
    ["sm", css.__.bsRed],
    ["md", css.__.bsOrange],
    ["lg", css.__.bsYellow],
    ["xl", css.__.bsPurple],
    ["xxl", css.__.bsBlue],
  ].forEach(([breakpoint, color]) => {
    const element = component.h2("invisible", {
      text: breakpoint.toUpperCase(),
      color,
      ...defaults,
    });

    app.effects.add(
      (change, message) => element.classes.if(!change[breakpoint], "invisible"),
      [breakpoint]
    );
  });

  container.append(plotContainer);

  Plotly.Plots.resize(plotContainer);
};
