/* This approach is robust (compared to tweaking old-school JS to work in module), 
but less efficient. Use as fallback. */

import raw from "./papa.js?raw"; // Adjust path; perhaps to minified version.

Function(raw)();
const csv = globalThis.Papa;
delete globalThis.Papa;

export { csv };
