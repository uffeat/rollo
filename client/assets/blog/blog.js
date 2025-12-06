const b = async () => ({
  reboot: await use("@/bootstrap/reboot.css"),
  shadow: await use("@/blog/shadow.css")
}), { component: r } = await use("@/component"), h = ({ path: a, ...s }) => {
  const { abstract: o, image: t, title: e } = s, c = r.div(
    "card",
    {},
    r.img("card-img-top", { src: `${use.meta.base}${t}` }),
    r.div(
      "card-body.nav.d-flex.flex-column",
      {},
      r.a(
        "nav-link",
        r.h1("card-title", { text: e, title: e })
      ),
      r.p("card-text", { text: o })
    ),
    r.div("card-footer")
  );
  return c.attribute.card = a, c;
}, { component: d } = await use("@/component"), { NavLink: w } = await use("@/router/"), g = (a) => {
  for (const s of a.querySelectorAll("img")) {
    const o = s.getAttribute("src");
    if (o.startsWith("/")) {
      const t = s.getAttribute("alt"), e = d.img({
        alt: t,
        src: `${use.meta.base}${o}`
      });
      s.replaceWith(e);
    }
  }
}, l = /* @__PURE__ */ new Map(), v = ({ html: a, path: s }) => {
  const o = d.div({ innerHTML: a, slot: "post" });
  o.attribute.post = s, g(o);
  for (const t of o.querySelectorAll("a[href]")) {
    const e = t.getAttribute("href");
    e.startsWith("/") && (t.parentElement.classList.add("nav"), t.replaceWith(w("nav-link", { path: e, text: t.textContent })));
  }
  return o;
}, { component: i } = await use("@/component"), { layout: u } = await use("@/layout/"), { ref: y } = await use("@/state"), { router: m } = await use("@/router/"), { toTop: $ } = await use("@/tools/scroll"), n = i.main(
  "container mt-3 mb-3",
  i.h1("py-3", { text: "Blog", slot: "title" })
), p = y();
p.effects.add(
  (a, s) => {
    const o = s.owner.previous;
    if (o && l.get(`/${o}`)?.remove(), a) {
      n.attribute.postView = !0;
      const t = `/${a}`;
      l.has(t) || m.error(`Invalid path: ${t}.`);
      const e = l.get(t);
      n.append(e), $(e);
    } else
      n.attribute.postView = !1;
  },
  { run: !1 }
);
async function x(a) {
  n.attribute.page = a, n.attachShadow({ mode: "open" }), await (async () => {
    const t = i.div(
      { id: "root" },
      i.slot({ name: "title" }),
      i.div({ "[cards]": !0 }, i.slot()),
      i.slot({ name: "post" })
    );
    n.detail.shadow = t, n.shadowRoot.append(t);
    const e = await b();
    e.reboot.use(n), e.shadow.use(n);
  })();
  const s = await use("@/content/bundle/blog.json");
  for (let t of s.manifest.map(([e, c]) => e)) {
    const e = s.bundle[t];
    t = `/${t.split("/").at(-1)}`;
    const c = h({ path: t, ...e.meta });
    n.append(c);
    const f = v({ html: e.content, path: t });
    l.set(t, f);
  }
  const o = "a.nav-link";
  n.on.click = async (t) => {
    if (t.target.matches(o) || t.target.closest(o)) {
      const e = t.target.closest("[card]");
      if (e) {
        const c = e.attribute.card;
        await m(`${a}${c}`);
      }
    }
  };
}
function k(a, s, ...o) {
  u.clear(":not([slot])"), u.append(n), p(o.at(0) || null);
}
function S(a, s, ...o) {
  p(o.at(0) || null);
}
function A(a) {
  n.remove();
}
const q = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  enter: k,
  exit: A,
  setup: x,
  update: S
}, Symbol.toStringTag, { value: "Module" }));
export {
  q as blog
};
