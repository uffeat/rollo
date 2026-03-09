let c = 0;
const p = () => c++, { Exception: u, is: i } = await use("@/rollo/"), _ = {
  method: "POST",
  headers: { "content-type": "text/plain; charset=utf-8" }
}, d = {}, l = async (r, ...e) => {
  const s = e.find((n, o) => !o && i.object(n)) || {};
  e = e.filter((n, o) => o || !i.object(n));
  const a = await fetch(r, {
    body: JSON.stringify({ data: { args: e, kwargs: s }, state: d }),
    ..._
  }), t = await a.json();
  return t.response = a, u.if("__error__" in t, t.__error__), t;
}, m = new Proxy(
  {},
  {
    get(r, e) {
      return async (...s) => l(
        `${use.meta.server.origin}/_/api/main?name=${e}&submission=${p()}`,
        ...s
      );
    }
  }
);
use.compose("server", m);
export {
  p as Submission,
  m as server,
  d as state
};
