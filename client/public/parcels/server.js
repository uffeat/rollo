let _ = 0;
const f = () => _++, { Exception: d, is: c } = await use("@/rollo/"), a = {
  method: "POST",
  headers: { "content-type": "text/plain; charset=utf-8" }
}, m = (t) => {
  const r = t.find((e, n) => !n && c.object(e)) || {}, s = t.find((e, n) => (!n || n === 1) && c.object(e) && e !== a) || {};
  return t = t.filter((e, n) => e !== s && e !== r), { args: t, kwargs: s, query: r };
}, l = (t) => {
  const r = new URLSearchParams(t).toString();
  return r ? `&${r}` : "";
}, w = new Proxy(
  {},
  {
    get(t, r) {
      return async (...s) => {
        const { args: e, kwargs: n, query: u } = m(s), p = `${use.meta.server.origin}/_/api/main?name=${r}&submission=${f()}${l(u)}`, i = await fetch(p, {
          body: JSON.stringify({ data: { args: e, kwargs: n } }),
          ...a
        }), o = await i.json();
        return o.response = i, d.if("__error__" in o, o.__error__), o;
      };
    }
  }
);
use.compose("server", w);
export {
  f as Submission,
  w as server
};
