import { Router } from "./router.js";
const { Exception } = await use("@/tools/exception.js");

/* Proxy version with leaner syntax  */
export const router = new Proxy(async () => {}, {
  get(target, key) {
    if (key === "router") {
      return Router;
    }
    Exception.if(!(key in Router), `Invalid key: ${key}`);
    const value = Router[key];
    if (typeof value === "function") {
      return value.bind(Router);
    }
    return value;
  },
  set(target, key, value) {
    Exception.if(!(key in Router), `Invalid key: ${key}`);
    Router[key] = value;
    return true;
  },
  apply(target, thisArg, args) {
    return Router.use(...args);
  },
  deleteProperty(target, key) {
    Router.routes.remove(key);
  },
  has(target, key) {
    return Router.routes.has(key);
  },
});
