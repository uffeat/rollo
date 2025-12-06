const g = `/* Cards per row */\r
#root {\r
  --gap: 0rem;\r
  --items: 1;\r
}\r
@media (width >= 768px) {\r
  #root {\r
    --gap: 0.25rem;\r
    --items: 2;\r
  }\r
}\r
@media (width >= 1200px) {\r
  #root {\r
    --gap: 0.5rem;\r
    --items: 3;\r
  }\r
}\r
\r
[cards] {\r
  width: 100%;\r
  display: flex;\r
  flex-wrap: wrap;\r
  justify-content: space-between;\r
  column-gap: var(--gap);\r
  row-gap: max(calc(1.5 * var(--gap)), 0.5rem);\r
}\r
\r
::slotted(.card) {\r
  width: calc(calc(100% / var(--items)) - var(--gap));\r
}\r
\r
:host([post-view]) :is([cards], slot[name="title"]) {\r
  display: none;\r
}\r
\r
\r
`, { component: r } = await use("@/component"), { layout: d } = await use("@/layout/"), { ref: b } = await use("@/state"), { router: m, NavLink: v } = await use("@/router/"), { toTop: y } = await use("@/tools/scroll"), x = await use("@/bootstrap/reboot.css"), { Sheet: S } = await use("@/sheet");
let h;
h = await use("@/blog/shadow.css");
console.log("shadowSheet:", h);
const s = r.main(
  "container mt-3 mb-3",
  r.h1("py-3", { text: "Blog", slot: "title" })
);
s.attachShadow({ mode: "open" });
const $ = r.div(
  { id: "root" },
  r.slot({ name: "title" }),
  r.div({ "[cards]": !0 }, r.slot()),
  r.slot({ name: "post" })
);
s.shadowRoot.append($);
x.use(s);
S.create(g).use(s);
const L = ({ html: n, path: o }) => {
  const t = r.div({ innerHTML: n }).firstChild, e = r.div(t.className, { innerHTML: t.innerHTML });
  return e.attribute.card = o, f(e), e;
}, l = /* @__PURE__ */ new Map(), k = ({ html: n, path: o }) => {
  const t = r.div({ innerHTML: n, slot: "post" });
  t.attribute.post = o, f(t);
  for (const e of t.querySelectorAll("a[href]")) {
    const c = e.getAttribute("href");
    c.startsWith("/") && (e.parentElement.classList.add("nav"), e.replaceWith(v("nav-link", { path: c, text: e.textContent })));
  }
  return t;
}, u = b();
u.effects.add(
  (n, o) => {
    const t = o.owner.previous;
    if (t && l.get(`/${t}`)?.remove(), n) {
      s.attribute.postView = !0;
      const e = `/${n}`;
      l.has(e) || m.error(`Invalid path: ${e}.`);
      const c = l.get(e);
      s.append(c), y(c);
    } else
      s.attribute.postView = !1;
  },
  { run: !1 }
);
async function M(n) {
  s.attribute.page = n;
  const o = await use("@/content/bundle/blog.json"), e = o.manifest.map(([a, i]) => a);
  for (let a of e) {
    const i = o.bundle[a];
    a = `/${a.split("/").at(-1)}`;
    const p = L({ html: i.meta.html, path: a });
    s.append(p);
    const w = k({ html: i.content, path: a });
    l.set(a, w);
  }
  const c = "a.nav-link";
  s.on.click = async (a) => {
    if (a.target.matches(c) || a.target.closest(c)) {
      const i = a.target.closest("[card]");
      if (i) {
        const p = i.attribute.card;
        await m(`${n}${p}`);
      }
    }
  };
}
function T(n, o, ...t) {
  d.clear(":not([slot])"), d.append(s), u(t.at(0) || null);
}
function A(n, o, ...t) {
  u(t.at(0) || null);
}
function C(n) {
  s.remove();
}
function f(n) {
  for (const o of n.querySelectorAll("img")) {
    const t = o.getAttribute("src");
    if (t.startsWith("/")) {
      const e = o.getAttribute("alt"), c = r.img({ alt: e, src: `${use.meta.base}${t}` });
      o.replaceWith(c);
    }
  }
}
const j = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  enter: T,
  exit: C,
  setup: M,
  update: A
}, Symbol.toStringTag, { value: "Module" }));
export {
  j as blog
};
