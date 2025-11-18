const { Exception } = await use("@/tools/exception.js");
const { type } = await use("@/tools/type.js");

//const { app } = await use("@/app/");


const instance = new (class Router {
  #_ = {
    registry: new Map(),
  };

  constructor() {}

  async set(path) {
    const mod = await use(path);
    await mod.default();
    path = path.slice(1, -3);
    if (location.pathname !== path) {
      history.pushState({}, "", path);
      app.$({ path: location.pathname });
    }
  }
})();





const set = async () => {
  if (location.pathname !== "/") {
    await instance.set(`@${location.pathname}.js`);
  } else {
    await instance.set(`@/test/home.js`);
  }
};

await set();

window.addEventListener("popstate", async (event) => {
  await set();
});

export const router = new Proxy(() => {}, {
  get(target, key) {
    Exception.if(!(key in instance), `Invalid key: ${key}`);
    const value = instance[key];
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
  set(target, key, value) {
    Exception.if(!(key in instance), `Invalid key: ${key}`);
    instance[key] = value;
    return true;
  },
  apply(target, thisArg, args) {
    return instance.set(...args);
  },
});

