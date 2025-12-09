/*
/d3/force.test.js
*/

import "@/use.js";
import { component } from "component";
import { layout } from "@/layout/layout.js";
import { Sheet, css, rule, scope } from "@/sheet/sheet.js";

import cssText from "./force.css?raw";

const { d3 } = await use("@/d3");

Sheet.create(cssText).use();

export default async () => {
  layout.clear(":not([slot])");

 

  const container = component.div('container', {
    id: "graph",
    parent: layout,
    innerHTML: `<svg role="img" aria-label="Graph"></svg>`,
  });

  const RADIUS = 8;
  const GAP = 6;

  const nodes = [
    { id: "A" },
    { id: "B" },
    { id: "C" },
    { id: "D" },
    { id: "E" },
  ];

  const links = [
    { source: "A", target: "B" },
    { source: "A", target: "C" },
    { source: "B", target: "D" },
    { source: "C", target: "D" },
    { source: "C", target: "E" },
  ];

  const svg = d3.select("#graph>svg");

  const width = svg.node().clientWidth;
  const height = svg.node().clientHeight;

  const g = svg.append("g");
  svg.call(
    d3
      .zoom()
      .extent([
        [0, 0],
        [width, height],
      ])
      .scaleExtent([0.25, 4])
      .on("zoom", (event) => g.attr("transform", event.transform))
  );

  /* Build the visuals */
  const link = g
    .append("g")
    .attr("stroke-linecap", "round")
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("class", "link");

  const node = g
    .append("g")
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("class", "node")
    .attr("r", RADIUS);

  const label = g
    .append("g")
    .selectAll("text")
    .data(nodes)
    .join("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text((d) => d.id);

  /* Create the simulation */
  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(80)
        .strength(0.6)
    )
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(16))
    .on("tick", ticked);

  /* Enable dragging */
  node.call(
    d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
  );

  function ticked() {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    label.attr("x", (d) => d.x).attr("y", (d) => d.y - (RADIUS + GAP));
  }

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  window.addEventListener("resize", () => {
    const w = svg.node().clientWidth;
    const h = svg.node().clientHeight;
    simulation.force("center", d3.forceCenter(w / 2, h / 2));
    simulation.alpha(0.5).restart();
  });
};
