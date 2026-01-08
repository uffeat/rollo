const { Exception, freeze } = await use("@/rollo/");

const options = {
  method: "POST",
  headers: { "content-type": "text/plain; charset=utf-8" },
};

const _fetch = async (url, data) => {
  const response = await fetch(url, {
    body: JSON.stringify(data),
    ...options,
  });

  console.log("response:", response); ////

  const parsed = await response.json();
  Exception.if("__error__" in parsed, parsed.__error__);
  return freeze(parsed);
};

export default (url, data) => {
  if (import.meta.env.DEV) {
    try {
      return _fetch(url, data);
    } catch {
      console.warn(`No access to server.`);
      return { result: null, meta: null };
    }
  } else {
    return _fetch(url, data);
  }
};
