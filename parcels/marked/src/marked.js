import { marked } from "marked";
//import {baseUrl} from "marked-base-url";

//import { Marked } from 'marked';
//const marked = new Marked([options, extension, ...]);

marked.use({
  async: false,
  pedantic: false,
  gfm: true,
});

//marked.use(baseUrl("https://example.com/folder/"));

// remove the most common zerowidth characters from the start of the file
//marked.parse(contents.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,""))

export { marked };
