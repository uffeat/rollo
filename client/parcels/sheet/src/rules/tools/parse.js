export function parse(head, body) {
  if (head.startsWith("max")) {
    return `@media (width <= ${head.slice(3)}px)`;
  }
  if (head.startsWith("min")) {
    return `@media (width >= ${head.slice(3)}px)`;
  }
  if (!head.startsWith("@keyframes") && body && isKeyframes(body)) {
    return `@keyframes ${head}`;
  }
  return head;
}

function isKeyframes(body) {
  const converted = Number(Object.keys(body)[0]);
  return typeof converted === "number" && !Number.isNaN(converted);
}
