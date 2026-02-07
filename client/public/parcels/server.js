let c = 0;
const i = () => c++, { Exception: _, is: a } = await use("@/rollo/"), u = {
  method: "POST",
  headers: { "content-type": "text/plain; charset=utf-8" }
}, p = async (t, ...e) => {
  const n = e.find((o, r) => !r && a.object(o)) || {};
  e = e.filter((o, r) => r || !a.object(o));
  const s = await (await fetch(t, {
    body: JSON.stringify({ data: { args: e, kwargs: n } }),
    ...u
  })).json();
  return _.if("__error__" in s, s.__error__), s;
}, d = (t, ...e) => p(t, ...e), f = new Proxy(
  {},
  {
    get(t, e) {
      return async (...n) => d(
        `${use.meta.server.origin}/_/api/main?name=${e}&submission=${i()}`,
        ...n
      );
    }
  }
);
use.compose("server", f);
export {
  f as server
};
