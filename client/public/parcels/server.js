let c = 0;
const i = () => c++, { Exception: _, is: a } = await use("@/rollo/"), p = {
  method: "POST",
  headers: { "content-type": "text/plain; charset=utf-8" }
}, u = async (e, ...t) => {
  const n = t.find((s, r) => !r && a.object(s)) || {};
  t = t.filter((s, r) => r || !a.object(s));
  const o = await (await fetch(e, {
    body: JSON.stringify({ data: { args: t, kwargs: n } }),
    ...p
  })).json();
  return _.if("__error__" in o, o.__error__), o;
}, d = (e, ...t) => u(e, ...t), f = new Proxy(
  {},
  {
    get(e, t) {
      return async (...n) => d(
        `${use.meta.companion.origin}/_/api/main?name=${t}&submission=${i()}`,
        ...n
      );
    }
  }
);
use.compose("server", f);
export {
  f as server
};
