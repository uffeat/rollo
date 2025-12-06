const { component: r } = await use("@/component"), { layout: d } = await use("@/layout/"), { ref: b } = await use("@/state"), { router: m, Nav: A, NavLink: g } = await use("@/router/"), { toTop: w } = await use("@/tools/scroll"), v = await use("@/bootstrap/reboot.css"), y = await use("/pages/blog/shadow.css", { as: "sheet" }), n = r.main(
  "container mt-3 mb-3",
  r.h1("py-3", { text: "Blog", slot: "title" })
);
n.attachShadow({ mode: "open" });
const $ = r.div(
  { id: "root" },
  r.slot({ name: "title" }),
  r.div({ "[cards]": !0 }, r.slot()),
  r.slot({ name: "post" })
);
n.shadowRoot.append($);
v.use(n);
y.use(n);
const L = ({ html: o, path: s }) => {
  const t = r.div({ innerHTML: o }).firstChild, e = r.div(t.className, { innerHTML: t.innerHTML });
  return e.attribute.card = s, f(e), e;
}, l = /* @__PURE__ */ new Map(), k = ({ html: o, path: s }) => {
  const t = r.div({ innerHTML: o, slot: "post" });
  t.attribute.post = s, f(t);
  for (const e of t.querySelectorAll("a[href]")) {
    const c = e.getAttribute("href");
    c.startsWith("/") && (e.parentElement.classList.add("nav"), e.replaceWith(g("nav-link", { path: c, text: e.textContent })));
  }
  return t;
}, u = b();
u.effects.add(
  (o, s) => {
    const t = s.owner.previous;
    if (t && l.get(`/${t}`)?.remove(), o) {
      n.attribute.postView = !0;
      const e = `/${o}`;
      l.has(e) || m.error(`Invalid path: ${e}.`);
      const c = l.get(e);
      n.append(c), w(c);
    } else
      n.attribute.postView = !1;
  },
  { run: !1 }
);
async function M(o) {
  n.attribute.page = o;
  const s = await use("@/content/bundle/blog.json"), e = s.manifest.map(([a, i]) => a);
  for (let a of e) {
    const i = s.bundle[a];
    a = `/${a.split("/").at(-1)}`;
    const p = L({ html: i.meta.html, path: a });
    n.append(p);
    const h = k({ html: i.content, path: a });
    l.set(a, h);
  }
  const c = "a.nav-link";
  n.on.click = async (a) => {
    if (a.target.matches(c) || a.target.closest(c)) {
      const i = a.target.closest("[card]");
      if (i) {
        const p = i.attribute.card;
        await m(`${o}${p}`);
      }
    }
  };
}
function S(o, s, ...t) {
  d.clear(":not([slot])"), d.append(n), u(t.at(0) || null);
}
function T(o, s, ...t) {
  u(t.at(0) || null);
}
function x(o) {
  n.remove();
}
function f(o) {
  for (const s of o.querySelectorAll("img")) {
    const t = s.getAttribute("src");
    if (t.startsWith("/")) {
      const e = s.getAttribute("alt"), c = r.img({ alt: e, src: `${use.meta.base}${t}` });
      s.replaceWith(c);
    }
  }
}
const q = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  enter: S,
  exit: x,
  setup: M,
  update: T
}, Symbol.toStringTag, { value: "Module" }));
export {
  q as blog
};
