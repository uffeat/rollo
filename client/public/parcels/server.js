let c = 0;
const l = () => c++, { Exception: u } = await use("@/rollo/"), p = {
  method: "POST",
  headers: { "content-type": "text/plain" }
}, _ = new Proxy(
  {},
  {
    get(b, r) {
      return async (t = {}, o = {}, ...i) => {
        t.submission = l(), t = JSON.stringify(t);
        const a = `${use.meta.server.origin}/_/api/main/${r}?query=${t}`, e = await fetch(a, {
          body: JSON.stringify({ data: { args: i, kwargs: o } }),
          ...p
        }), n = e.headers.get("content-type");
        if (n.startsWith("application/json")) {
          const s = await e.json();
          return u.if("__error__" in s, s.__error__), s;
        }
        return n.startsWith("image/") ? { result: await e.blob() } : { result: await e.blob() };
      };
    }
  }
);
use.compose("server", _);
export {
  l as Submission,
  _ as server
};
