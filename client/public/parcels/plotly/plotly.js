const { css: c, freeze: T } = await use("@/rollo/"), j = T([
  c.root.bsBlue,
  c.root.bsGreen,
  c.root.bsPink,
  c.root.bsIndigo,
  c.root.bsTeal,
  c.root.bsOrange,
  c.root.bsYellow
]), L = c.root.bsLight, l = (s, t = {}) => ({ title: { text: s }, ...t }), w = () => ({
  colorway: j,
  font: { color: L }
}), { Exception: C, is: a, merge: M, typeName: B } = await use("@/rollo/");
class A {
  #t = {};
  constructor(t, e) {
    this.#t.owner = t, this.#t.data = e;
  }
  get size() {
    return this.#t.data.length;
  }
  /* Returns index by name. */
  index(t, { strict: e = !1 } = {}) {
    let r = 0;
    for (const n of this.#t.data) {
      if (n.name === t)
        return r;
      r++;
    }
    return C.if(e, `Invalid name: ${t}.`), null;
  }
  /* Inserts single trace relative to trace by index or name.
  Appends if invalid reference. */
  insert(t, e) {
    return a.string(e) ? e = this.index(e, { strict: !0 }) : (a.undefined(e) || e > this.size) && (e = this.size), this.#t.data.splice(e, 0, t), this.#t.owner.redraw(), this.#t.owner;
  }
  /* Removes single trace by index or name. */
  remove(t) {
    if (a.string(t)) {
      if (t = this.index(t, { strict: !1 }), a.null(t))
        return this.#t.owner;
    } else if (t >= this.size)
      return this.#t.owner;
    return this.#t.data.splice(t, 1), this.#t.owner.redraw(), this.#t.owner;
  }
  /* Updates single trace by index or name. Falsy 'updates' removes. */
  update(t, e) {
    if (!e)
      return this.remove(t);
    a.string(t) ? t = this.index(t, { strict: !0 }) : C.if(t >= this.size, `Invalid index: ${t}.`);
    const r = this.#t.data[t];
    return M(r, e), this.#t.owner.redraw(), this.#t.owner;
  }
  /* Inserts single trace relative to trace by index or name.
  Appends if invalid reference.
  NOTE Use 'insert' instead. Cheap to keep as a Plotly-canonical approach; 
  perhaps useful in special cases. */
  _insert(t, e) {
    return a.string(e) ? (e = this.index(e, { strict: !0 }), this.#t.owner.plotly.addTraces(t, e)) : a.undefined(e) ? this.#t.owner.plotly.addTraces(t) : e === 0 ? this.#t.owner.plotly.prependTraces(t) : (e > this.size && (e = this.size), this.#t.owner.plotly.addTraces(t, e)), this.#t.owner;
  }
  /* Removes single trace by index or name.
  NOTE Use 'remove' instead. Cheap to keep as a Plotly-canonical approach; 
  perhaps useful in special cases. */
  _remove(t) {
    if (a.string(t)) {
      if (t = this.index(t, { strict: !1 }), a.null(t))
        return this.#t.owner;
    } else if (t >= this.size)
      return this.#t.owner;
    return this.#t.owner.plotly.deleteTraces(t), this.#t.owner;
  }
  /* Updates single trace.
  NOTE Use 'update' instead. Cheap to keep as a Plotly-canonical approach
  (or something close to that); perhaps useful in special cases. */
  _update(t, e) {
    if (!e)
      return this._remove(t);
    a.string(t) ? t = this.index(t, { strict: !0 }) : C.if(t >= this.size, `Invalid index: ${t}.`);
    const r = {};
    for (const [n, o] of Object.entries(e)) {
      if (Array.isArray(o)) {
        r[n] = o.length === 1 && Array.isArray(o[0]) ? o : [o];
        continue;
      }
      r[n] = o;
    }
    return this.#t.owner.plotly.restyle(r, t), this.#t.owner;
  }
}
const {
  Exception: _,
  Mixins: E,
  app: k,
  author: x,
  element: N,
  freeze: O,
  mix: $,
  stateMixin: D
} = await use("@/rollo/"), I = x(
  class extends $(HTMLElement, {}, ...E(D)) {
    #t = {
      config: {
        displaylogo: !1
      },
      data: [],
      layout: w()
    };
    constructor() {
      super(), this.#t.container = N.div(), this.#t.onresize = (s) => {
        this.resize();
      };
    }
    setup(s, ...t) {
      this.#t.Plotly = s;
      const e = this;
      return this.#t.plotly = new Proxy(() => {
      }, {
        get(r, n) {
          return (...o) => s[n](e.#t.container, ...o);
        }
      }), this.update(...t);
    }
    /* Returns container child. 
    NOTE Can be used in combination with 'Plotly' to do stuff that this component 
    does not support, while still taking advantage of component features. */
    get container() {
      return this.#t.container;
    }
    /* Returns frozen copy of config. */
    get config() {
      return O(structuredClone(this.#t.config));
    }
    /* Returns frozen copy of data. */
    get data() {
      return O(structuredClone(this.#t.data));
    }
    /* Returns frozen copy of layout. */
    get layout() {
      return O(structuredClone(this.#t.layout));
    }
    /* Returns controller, from which Plotly methods can be called with container 
    implicitly passed as first arg. 
    NOTE Sugar and useful for doing stuff beyond component features. */
    get plotly() {
      return this.#t.plotly;
    }
    /* Returns controller for traces. */
    get traces() {
      return _.if(!this.#t.traces, "Traces not yey available,"), _.if(!this.isConnected, "Not DOM-connected."), this.#t.traces;
    }
    connectedCallback() {
      super.connectedCallback?.(), this.#t.Plotly.newPlot(
        this.#t.container,
        this.#t.data,
        this.#t.layout,
        this.#t.config
      ), requestAnimationFrame(() => {
        this.resize();
      }), k.addEventListener("_resize_x", this.#t.onresize);
    }
    disconnectedCallback() {
      super.disconnectedCallback?.(), this.#t.Plotly.purge(this.#t.container), k.removeEventListener("_resize_x", this.#t.onresize);
    }
    __new__(...s) {
      super.__new__?.(...s), this.append(this.#t.container);
    }
    /* Redraws plot. Call after mutation of Plotly-related items. */
    redraw() {
      return _.if(!this.isConnected, "Not DOM-connected."), this.#t.Plotly.redraw(this.#t.container), this;
    }
    /* Updates plot layout. */
    relayout(s) {
      return _.if(!this.isConnected, "Not DOM-connected."), this.#t.Plotly.relayout(this.#t.container, s), this;
    }
    /* Resizes plot. Call to force responsive sizing. */
    resize() {
      return _.if(!this.isConnected, "Not DOM-connected."), this.#t.Plotly.Plots.resize(this.#t.container), this;
    }
    /* Updates component and handles special Plotly-related items. */
    update({ config: s, data: t, layout: e, ...r } = {}) {
      return s && (this.#t.config = s), t && (this.#t.data = t, this.#t.traces = new A(this, this.#t.data)), e && (this.#t.layout = e), this.isConnected && this.#t.Plotly.react(
        this.#t.container,
        this.#t.data,
        this.#t.layout,
        this.#t.config
      ), super.update?.(r), this;
    }
  },
  "plotly-component"
), m = async (...s) => {
  const t = I(), { Plotly: e } = await use("/plotly/plotly.js");
  return t.setup(e, ...s), t;
}, F = async ({ xaxis: s, yaxis: t, x: e, ...r }, ...n) => {
  const o = [];
  for (const h of n)
    for (const [u, i] of Object.entries(h))
      o.push({ x: e, y: i, type: "bar", name: u });
  return await m({
    data: o,
    layout: {
      xaxis: l(s),
      yaxis: l(t),
      ...w()
    },
    ...r
  });
}, q = async ({ xaxis: s, yaxis: t, ...e }, ...r) => {
  const n = [];
  for (const p of r)
    for (const [h, u] of Object.entries(p)) {
      const i = [], z = [], y = [];
      for (const [d, g, f] of u)
        i.push(d), z.push(g), y.push(f);
      n.push({
        type: "scatter",
        mode: "markers",
        name: h,
        marker: {
          size: y
        },
        x: i,
        y: z
      });
    }
  return await m({
    data: n,
    layout: {
      xaxis: l(s),
      yaxis: l(t),
      //showlegend: false,
      ...w()
    },
    ...e
  });
}, G = async ({ lines: s = !0, markers: t = !0, smooth: e = !1, xaxis: r, yaxis: n, ...o }, ...p) => {
  const h = (() => {
    if (s && t)
      return "lines+markers";
    if (s && !t)
      return "lines";
    if (!s && t)
      return "markers";
  })(), u = { shape: e ? "spline" : "linear" }, i = [];
  for (const y of p)
    for (const [d, g] of Object.entries(y)) {
      const f = [], b = [];
      for (const [v, P] of g)
        f.push(v), b.push(P);
      i.push({
        type: "scatter",
        mode: h,
        line: u,
        name: d,
        x: f,
        y: b
      });
    }
  return await m({
    data: i,
    layout: {
      xaxis: l(r),
      yaxis: l(n),
      ...w()
    },
    ...o
  });
}, H = async (...s) => {
  const t = [], e = [];
  for (const r of s)
    for (const [n, o] of Object.entries(r))
      t.push(n), e.push(o);
  return await m({
    data: [
      {
        values: e,
        labels: t,
        type: "pie",
        textinfo: "label+percent"
      }
    ],
    layout: {
      showlegend: !1,
      ...w()
    }
  });
}, S = async ({ lines: s = !0, markers: t = !0, smooth: e = !1, xaxis: r, yaxis: n, ...o }, ...p) => {
  const h = (() => {
    if (s && t)
      return "lines+markers";
    if (s && !t)
      return "lines";
    if (!s && t)
      return "markers";
  })(), u = { shape: e ? "spline" : "linear" }, i = [];
  for (const y of p)
    for (const [d, g] of Object.entries(y)) {
      const f = [], b = [];
      for (const [v, P] of g)
        f.push(v), b.push(P);
      i.push({
        type: "scatter",
        stackgroup: "one",
        mode: h,
        line: u,
        name: d,
        x: f,
        y: b
      });
    }
  return await m({
    data: i,
    layout: {
      xaxis: l(r),
      yaxis: l(n),
      ...w()
    },
    ...o
  });
};
export {
  l as Axis,
  F as Bar,
  q as Bubble,
  w as Layout,
  G as Line,
  H as Pie,
  m as Plot,
  S as Stacked,
  A as Traces
};
