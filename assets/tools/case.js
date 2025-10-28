export function camelToKebab(camel) {
  /* NOTE Digits are treated as lower-case characters, 
  i.e., p10 -> p10. */
  return camel.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

export function camelToSnake(camel) {
  const kebab = this.camel_to_kebab(camel);
  const snake = kebab.replaceAll("-", "_");
  return snake;
}

export function kebabToCamel(kebab) {
  return kebab.replace(/-([a-z])/g, function (match, capture) {
    return capture.toUpperCase();
  });
}

export function pascalToCamel(pascal) {
  if (pascal.length === 0) return pascal;
  return pascal[0].toLowerCase() + pascal.slice(1);
}

export function pascalToKebab(pascal) {
  return pascal
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "");
}

export function snakeToCamel(snake) {
  const kebab = snake.replaceAll("_", "-");
  return this.kebab_to_camel(kebab);
}


export const isUpper = (char) => {
  return /^[A-Z]/.test(char);
}

export const capitalize = (text) => {
  if (text.length > 0) {
    text = text[0].toUpperCase() + text.slice(1);
  }
  return text;
};
