const joinTemplate = (strings, values) => {
  if (!values.length) return strings[0];

  let result = strings[0];
  for (let i = 0; i < values.length; i++) {
    result += String(values[i]) + strings[i + 1];
  }
  return result;
};

/* Returns interpolated string as-is. 
Exclusively used as prefix to trigger `html` VS Code plugin intended for lit.
(without using lit). */
export const html = (strings, ...values) => joinTemplate(strings, values);

