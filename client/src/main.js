/* Initialize import engine and load main sheet (with Tailwind) */
import "@/main.css";
import "@/use";

import { Plot } from "@/plotly"; ////

//import "@/router";

import { api, rpc } from "@/server";

const { app, Sheet, component, element, css } = await use("@/rollo/");
const { frame } = await use("@/frame/");

const plot = Plot({
  data: [
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
  parent: app,
});

plot.traces.update(0, { y: [200, 200, 20] });
plot.traces.add({
  x: ["Zebras", "Lions", "Pelicans"],
  y: [8, 80, 46],
  type: "bar",
  name: "Copenhagen",
});

plot.update({
  layout: {
    xaxis: {
      title: {
        text: "Animal",
      },
    },
    yaxis: {
      title: {
        text: "Number",
      },
    },
  },
});

const plot2 = Plot({ parent: app });

await (async () => {
  //const { data, meta } = await api.echo({ ding: 42, dong: true, foo: "FOO" });
  //console.log("data:", data);
  //console.log("meta:", meta);
})();

/*
await (async () => {
  const { data, meta } = await rpc.echo({ ding: 42, dong: true, foo: "FOO" });
  console.log("data:", data);
  console.log("meta:", meta);
})();
*/

if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}
