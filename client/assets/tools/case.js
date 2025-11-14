export function camelToKebab(camel, { numbers = false } = {}) {
  if (numbers) {
    return String(camel)
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/([A-Za-z])([0-9])/g, "$1-$2")
      .replace(/([0-9])([A-Za-z])/g, "$1-$2")
      .toLowerCase();
  }
  return String(camel)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

export function camelToPascal(camel) {
  if (!camel.length) return camel;
  return camel[0].toUpperCase() + camel.slice(1);
}

export function kebabToCamel(kebab) {
  return String(kebab)
    .toLowerCase()
    .replace(/[-_\s]+([a-z0-9])/g, (_, c) => c.toUpperCase());
}

export function kebabToPascal(kebab) {
  return String(kebab)
    .toLowerCase()
    .replace(/[-_\s]+([a-z0-9])/g, (_, c) => c.toUpperCase())
    .replace(/^([a-z])/, (_, c) => c.toUpperCase());
}

export function kebabToSnake(kebab) {
  return kebab.replaceAll("-", "_");
}

export function pascalToCamel(pascal) {
  if (!pascal.length) return pascal;
  return pascal[0].toLowerCase() + pascal.slice(1);
}

export function pascalToKebab(pascal, { numbers = false } = {}) {
  if (numbers) {
    return String(pascal)
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/([A-Za-z])([0-9])/g, "$1-$2")
      .replace(/([0-9])([A-Za-z])/g, "$1-$2")
      .replace(/^([A-Z])/, (m) => m.toLowerCase())
      .toLowerCase();
  }
  return String(pascal)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/^([A-Z])/, (m) => m.toLowerCase())
    .toLowerCase();

  
}

export function snakeToKebab(snake) {
  return snake.replaceAll("_", "-");
}

export const isUpper = (char) => {
  return /^[A-Z]/.test(char);
};

export const capitalize = (text) => {
  if (text.length > 0) {
    text = text[0].toUpperCase() + text.slice(1);
  }
  return text;
};
