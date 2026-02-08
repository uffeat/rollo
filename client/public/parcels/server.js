let i = 0;
const _ = () => i++, { Exception: u, is: c } = await use("@/rollo/"), p = {
  method: "POST",
  headers: { "content-type": "text/plain; charset=utf-8" }
}, d = async (t, ...e) => {
  const s = e.find((o, r) => !r && c.object(o)) || {};
  e = e.filter((o, r) => r || !c.object(o));
  const a = await fetch(t, {
    body: JSON.stringify({ data: { args: e, kwargs: s } }),
    ...p
  }), n = await a.json();
  return n.response = a, u.if("__error__" in n, n.__error__), n;
}, f = (t, ...e) => d(t, ...e), m = new Proxy(
  {},
  {
    get(t, e) {
      return async (...s) => f(
        `${use.meta.server.origin}/_/api/main?name=${e}&submission=${_()}`,
        ...s
      );
    }
  }
);
use.compose("server", m);
export {
  m as server
};
