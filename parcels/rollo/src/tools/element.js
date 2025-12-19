import { Parse } from "../component/tools/factory";

export function updateElement(...args) {



  return this

}

/* Returns instance factory for HTML element. */
export const element = new Proxy(
  {},
  {
    get(_, tag) {
      return (...args) => {
        const result = document.createElement(tag)
        updateElement.call(result, ...args)
        return result

      }
      
    },
  }
);