let c = 0;
const u = () => c++, { Exception: _, is: a } = await use("@/rollo/"), p = {
  method: "POST",
  headers: { "content-type": "text/plain; charset=utf-8" }
}, d = async (t, ...e) => {
  const n = e.find((o, r) => !r && a.object(o)) || {};
  e = e.filter((o, r) => r || !a.object(o));
  const i = await fetch(t, {
    body: JSON.stringify({ data: { args: e, kwargs: n } }),
    ...p
  }), s = await i.json();
  return s.response = i, _.if("__error__" in s, s.__error__), s;
}, f = (t, ...e) => d(t, ...e), m = new Proxy(
  {},
  {
    get(t, e) {
      return async (...n) => f(
        `${use.meta.server.origin}/_/api/main?name=${e}&session=${use.meta.session}&submission=${u()}`,
        ...n
      );
    }
  }
);
use.compose("server", m);
export {
  m as server
};
