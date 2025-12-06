const { component: r } = await use("@/component"), { layout: d } = await use("@/layout/"), { ref: w } = await use("@/state"), { router: m, NavLink: g } = await use("@/router/"), { toTop: v } = await use("@/tools/scroll"), f = await (async () => ({
  reboot: await use("@/bootstrap/reboot.css"),
  shadow: await use("@/blog/shadow.css")
}))(), a = r.main(
  "container mt-3 mb-3",
  r.h1("py-3", { text: "Blog", slot: "title" })
);
a.attachShadow({ mode: "open" });
a.detail.shadow = r.div(
  { id: "root" },
  r.slot({ name: "title" }),
  r.div({ "[cards]": !0 }, r.slot()),
  r.slot({ name: "post" })
);
a.shadowRoot.append(a.detail.shadow);
f.reboot.use(a);
f.shadow.use(a);
const y = ({ html: o, path: s }) => {
  const t = r.div({ innerHTML: o }).firstChild, e = r.div(t.className, { innerHTML: t.innerHTML });
  return e.attribute.card = s, h(e), e;
}, l = /* @__PURE__ */ new Map(), $ = ({ html: o, path: s }) => {
  const t = r.div({ innerHTML: o, slot: "post" });
  t.attribute.post = s, h(t);
  for (const e of t.querySelectorAll("a[href]")) {
    const c = e.getAttribute("href");
    c.startsWith("/") && (e.parentElement.classList.add("nav"), e.replaceWith(g("nav-link", { path: c, text: e.textContent })));
  }
  return t;
}, p = w();
p.effects.add(
  (o, s) => {
    const t = s.owner.previous;
    if (t && l.get(`/${t}`)?.remove(), o) {
      a.attribute.postView = !0;
      const e = `/${o}`;
      l.has(e) || m.error(`Invalid path: ${e}.`);
      const c = l.get(e);
      a.append(c), v(c);
    } else
      a.attribute.postView = !1;
  },
  { run: !1 }
);
async function L(o) {
  a.attribute.page = o;
  const s = await use("@/content/bundle/blog.json"), e = s.manifest.map(([n, i]) => n);
  for (let n of e) {
    const i = s.bundle[n];
    n = `/${n.split("/").at(-1)}`;
    const u = y({ html: i.meta.html, path: n });
    a.append(u);
    const b = $({ html: i.content, path: n });
    l.set(n, b);
  }
  const c = "a.nav-link";
  a.on.click = async (n) => {
    if (n.target.matches(c) || n.target.closest(c)) {
      const i = n.target.closest("[card]");
      if (i) {
        const u = i.attribute.card;
        await m(`${o}${u}`);
      }
    }
  };
}
function k(o, s, ...t) {
  d.clear(":not([slot])"), d.append(a), p(t.at(0) || null);
}
function M(o, s, ...t) {
  p(t.at(0) || null);
}
function T(o) {
  a.remove();
}
function h(o) {
  for (const s of o.querySelectorAll("img")) {
    const t = s.getAttribute("src");
    if (t.startsWith("/")) {
      const e = s.getAttribute("alt"), c = r.img({ alt: e, src: `${use.meta.base}${t}` });
      s.replaceWith(c);
    }
  }
}
const x = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  enter: k,
  exit: T,
  setup: L,
  update: M
}, Symbol.toStringTag, { value: "Module" }));
export {
  x as blog
};
