let u = 0;
const p = () => u++, { Exception: g } = await use("@/rollo/"), l = {
  cache: "no-store",
  method: "POST",
  headers: { "content-type": "text/plain" }
}, _ = new Proxy(
  {},
  {
    get(m, o) {
      return async (e = {}, r = {}, ...i) => {
        const n = p();
        e.submission = n, use.meta.DEV && console.log("Server origin:", use.meta.server.origin);
        const a = `${use.meta.server.origin}/_/api/main/${o}?query=${JSON.stringify(e)}`, t = await fetch(a, {
          body: JSON.stringify({ data: { args: i, kwargs: r } }),
          ...l
        });
        if (t.headers.get("content-type").startsWith("application/json")) {
          const s = await t.json();
          return g.if("__error__" in s, s.__error__), s;
        }
        const c = await t.blob();
        return { meta: {
          env: use.meta.server.env,
          detail: {},
          name: o,
          origin: use.meta.server.origin,
          request_origin: location.origin,
          request_type: "api",
          same_origin: location.origin === use.meta.server.origin,
          submission: n,
          test: e.test || !1
        }, result: c };
      };
    }
  }
);
use.compose("server", _);
export {
  p as Submission,
  _ as server
};
