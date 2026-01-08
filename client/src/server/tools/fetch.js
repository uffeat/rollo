const { Exception, freeze } = await use("@/rollo/");

const options = {
  method: "POST",
  headers: { "content-type": "text/plain; charset=utf-8" },
};

export default async (url, data) => {
  const response = await fetch(url, {
    body: JSON.stringify(data),
    ...options,
  });
  const parsed = await response.json();
  Exception.if("__error__" in parsed, parsed.__error__);
  return freeze(parsed);
};
