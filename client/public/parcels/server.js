let p = 0;
const _ = () => p++, { Exception: f, is: c } = await use("@/rollo/"), d = {
  method: "POST",
  headers: { "content-type": "text/plain; charset=utf-8" }
}, m = (t) => {
  const r = t.find((e, n) => !n && c.object(e)) || {}, s = t.find((e, n) => (!n || n === 1) && c.object(e) && e !== r) || {};
  return t = t.filter((e, n) => e !== r && e !== s), { args: t, kwargs: r, query: s };
}, l = (t) => {
  const r = new URLSearchParams(t).toString();
  return r ? `&${r}` : "";
}, w = new Proxy(
  {},
  {
    get(t, r) {
      return async (...s) => {
        const { args: e, kwargs: n, query: a } = m(s), u = `${use.meta.server.origin}/_/api/main?name=${r}&submission=${_()}${l(a)}`, i = await fetch(u, {
          body: JSON.stringify({ data: { args: e, kwargs: n } }),
          ...d
        }), o = await i.json();
        return o.response = i, f.if("__error__" in o, o.__error__), o;
      };
    }
  }
);
use.compose("server", w);
export {
  _ as Submission,
  w as server
};
