import "../../../use.js";


const { typename } = await use("/tools/type.js");

export function update(updates) {
  if (!(this instanceof CSSRule)) {
    console.error(`Context:`, this);
    throw new Error(`Invalid context.`);
  }

  for (let [key, value] of Object.entries(updates)) {
    /* Ignore, if undefined, e.g., for efficient use of iife's */
    if (value === undefined) {
      continue;
    }

    if (typename(value) === "Object") {
      const [u, v] = Object.entries(value)[0];
      value = `${v}${u}`;
    }

    if (key.startsWith("__")) {
      key = `--${key.slice(2)}`;
    } else if (!key.startsWith("--")) {
      key = kebab(key.trim());
      
    }
    /* By convention, false removes */
    if (value === false) {
      this.style.removeProperty(key);
      continue;
    }
    if (typeof value === "string") {
      value = value.trim();
      /* Handle priority */
      if (value.endsWith("!important")) {
        this.style.setProperty(
          key,
          value.slice(0, -"!important".length),
          "important"
        );
      } else {
        this.style.setProperty(key, value);
      }
      continue;
    }
    /* Interpret value as per conventions */
    if (value === null) {
      value = "none";
    }
    this.style.setProperty(key, value);
  }
  return this;
}

function kebab(camel) {
  /* NOTE Digits are treated as lower-case characters, 
  i.e., p10 -> p10. */
  return camel.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}