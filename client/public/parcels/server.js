let c = 0;
const u = () => c++, { Exception: _, is: i } = await use("@/rollo/"), p = {
  method: "POST",
  headers: { "content-type": "text/plain; charset=utf-8" }
}, m = async (t, ...e) => {
  const n = e.find((o, r) => !r && i.object(o)) || {};
  e = e.filter((o, r) => r || !i.object(o));
  const a = await fetch(t, {
    body: JSON.stringify({ data: { args: e, kwargs: n } }),
    ...p
  }), s = await a.json();
  return s.response = a, _.if("__error__" in s, s.__error__), s;
}, d = (t, ...e) => m(t, ...e), f = new Proxy(
  {},
  {
    get(t, e) {
      return async (...n) => d(
        `${use.meta.server.origin}/_/api/main?name=${e}&token=${use.meta.token}&session=${use.meta.session}&submission=${u()}`,
        ...n
      );
    }
  }
);
use.compose("server", f);
export {
  f as server
};
