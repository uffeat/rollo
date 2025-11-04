const Exception = await use("exception.js");
const { typeName } = await use("@/tools/types.js");
const { match: arrayMatch } = await use("@/tools/array/match.js");
const { match: objectMatch } = await use("@/tools/object/match.js");

export class Reactive {
  static create = (...args) => new Reactive(...args);

 
}



