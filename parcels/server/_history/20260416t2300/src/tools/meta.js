export const Meta = (response) => {
  const type = response.headers.get("content-type").trim();
  if (type.startsWith("{")) {
    return JSON.parse(type);
  }
  return { type };
};