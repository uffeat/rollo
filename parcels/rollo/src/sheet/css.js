import { Sheet } from "./sheet";

const joinTemplate = (strings, values) => {
  if (!values.length) return Sheet.create(strings[0]);
  let result = strings[0];
  for (let i = 0; i < values.length; i++) {
    result += String(values[i]) + strings[i + 1];
  }
  return Sheet.create(result);
};

/* Returns constructed sheet from css text. 
NOTE Hijacks VS Code plugin intended for lit (without using lit) to obtain 
linting etc. */
export function css(strings, ...values) {
  return joinTemplate(strings, values)
};
