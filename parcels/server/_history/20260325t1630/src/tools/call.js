import "../../use";

const { Exception, is } = await use("@/rollo/");

const options = {
  method: "POST",
  headers: { "content-type": "text/plain; charset=utf-8" },
};

export const state = {};

export const call = async (url, ...args) => {
  const kwargs = args.find((a, i) => !i && is.object(a)) || {};
  args = args.filter((a, i) => i || !is.object(a));

  const data = { data: { args, kwargs, state } };

  const response = await fetch(url, {
    body: JSON.stringify(data),
    ...options,
  });
  const parsed = await response.json();
  parsed.response = response
  Exception.if("__error__" in parsed, parsed.__error__);
  
  return parsed;
};

