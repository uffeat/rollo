import "../../use";

const { Exception, is } = await use("@/rollo/");

const options = {
  method: "POST",
  headers: { "content-type": "text/plain; charset=utf-8" },
};

const _fetch = async (url, ...args) => {
  const kwargs = args.find((a, i) => !i && is.object(a)) || {};
  args = args.filter((a, i) => i || !is.object(a));

  const data = { data: { args, kwargs } };

  const response = await fetch(url, {
    body: JSON.stringify(data),
    ...options,
  });
  const parsed = await response.json();
  parsed.response = response
  Exception.if("__error__" in parsed, parsed.__error__);
  return parsed;
};

export default (url, ...args) => {
  if (import.meta.env.DEV) {
    try {
      return _fetch(url, ...args);
    } catch {
      console.warn(`No access to server.`);
      return { result: null, meta: null };
    }
  } else {
    return _fetch(url, ...args);
  }
};
