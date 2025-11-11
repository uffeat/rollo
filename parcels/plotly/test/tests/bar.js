/*
bar.js
*/
//import cssText from '../assets/sheet.css?raw'
import "../assets/sheet.css";

const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");
const { Sheet, css } = await use("@/sheet.js");

const container = document.createElement("div");
container.classList.add("plot");
layout.append(container);

export default async ({ Plotly }) => {
  const trace1 = {
    x: ["Zebras", "Lions", "Pelicans"],
    y: [90, 40, 60],
    type: "bar",
    name: "New York Zoo",
    marker: {
      //color: '#0d6efd',
      line: {
        color: "rgba(55,128,191,1.0)",
        width: 0.1,
      },
    },
  };

  const trace2 = {
    x: ["Zebras", "Lions", "Pelicans"],
    y: [10, 80, 45],
    type: "bar",
    name: "San Francisco Zoo",
  };

  const data = [trace1, trace2];

  const layout = {
    title: {
      text: "Stuff",
      font: {
        //family: "Courier New, monospace",
        size: 18,
      },
      xref: "paper",
      yref: "paper",
      automargin: true,
      x: 0.05,
    },

    showlegend: true,
    legend: {
      x: 1,
      y: 0.5,
      traceorder: "normal",
      font: {
        family: "sans-serif",
        size: 12,
        color: "#000",
      },
      bgcolor: "#E2E2E2",
      bordercolor: "#FFFFFF",
      borderwidth: 2,
      orientation: "v",
    },

    colorway: [
      "#0d6efd", // BS primary
      "#198754", // BS success
      "#cd7eaf",
      "#a262a9",
      "#6f4d96",
      "#3d3b72",
      "#182844",
    ],

    //autosize: false,
    //width: 500,
    height: 500,
    margin: {
      l: 50,
      r: 50,
      b: 100,
      t: 100,
      pad: 4,
    },
    paper_bgcolor: "#c7c7c7",
    plot_bgcolor: "#c7c7c7",

    xaxis: {
      title: {
        text: "x Axis",
        font: {
          //family: 'Courier New, monospace',
          size: 16,
          color: "#7f7f7f",
        },
      },
    },
    yaxis: {
      title: {
        text: "y Axis",
        font: {
          //family: 'Courier New, monospace',
          size: 16,
          color: "#7f7f7f",
        },
      },
    },
    barcornerradius: 8,
  };

  const config = {
    displaylogo: false,
    responsive: true,
  };

  Plotly.newPlot(container, data, layout, config);
};
