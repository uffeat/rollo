const w = (t) => {
  const e = t.headers.get("content-type").trim();
  return e.startsWith("{") ? JSON.parse(e) : { type: e };
};
let S = 0;
const v = () => S++, { Exception: O, freeze: g, is: $, typeName: b } = await use("@/rollo/"), N = g({
  cache: "no-store",
  method: "POST",
  headers: { "content-type": "text/plain" }
}), d = new class {
  call(t) {
    return ({ callback: e, encode: s, test: r = !1, ...n } = {}) => async (o = {}, ...a) => {
      const c = v(), f = `query=${JSON.stringify({ submission: c, test: r, ...n })}`, h = `${use.meta.server.origin}/_/api/main/${t}?${f}`, i = await fetch(h, {
        body: JSON.stringify({ data: { args: a, kwargs: o } }),
        ...N
      }), { name: l, type: u } = w(i);
      if (u.startsWith("application/json")) {
        const p = await i.json();
        O.if("__error__" in p, p.__error__);
        const { result: m, meta: _ } = p;
        return e && e({ result: m, meta: _ }), { result: m, meta: _ };
      }
      const y = await i[s || "blob"]();
      return e && e({ content: y, name: l, type: u }), { content: y, name: l, type: u };
    };
  }
}(), x = new Proxy(async () => {
}, {
  get(t, e) {
    return d.call(e);
  }
});
use.sources.add("server", ({ options: t, path: e }) => async (s, ...r) => {
  const { callback: n, encode: o, test: a = !1, ...c } = t;
  return await d.call(e.stem)({ callback: n, encode: o, test: a, ...c })(
    s,
    ...r
  );
});
use.compose("server", x);
export {
  d as Server,
  v as Submission,
  x as server
};
