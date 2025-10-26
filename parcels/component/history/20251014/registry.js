import "../../use.js";

export const registry = new (class {
  #_ = {
    registry: new Map(),
  };

  add(cls, key, native) {
    /* Get 'key' from cls if not provided */
    if (!key) {
      key = cls.__key__;
    }
    /* Get 'native' from cls if not provided */
    if (!native) {
      native = cls.__native__;
    }

    if (import.meta.env.DEV) {
      /* In DEV, test scripts may attempt double registration, which (in DEV) 
      should be ignored. NOTE Cannot use 'this.#_.registry' since the
      dev context may have recreated it. Use 'customElements', which of course
      assumes dev work NOT done in Safari (as if...) */
      const current = customElements.get(key);
      if (current) {
        console.log(`Fending off double registration of component with key:`, key)
        return current;
      }
    }

    /* Prepare object to be patched onto cls */
    const __meta__ = { key };

    /* Define */
    if (native) {


      __meta__.native = native;
      
      customElements.define(key, cls, {
        extends: native,
      });

      if (use.meta.DEV) {
        console.info(`Defined '${key}' component extended from '${native}'.`);
      }
    } else {
      customElements.define(key, cls);

      if (use.meta.DEV) {
        console.info(`Defined '${key}' component.`);
      }
    }

    /* Patch on meta */
    Object.defineProperty(cls, "__meta__", {
      configurable: false,
      enumerable: true,
      writable: false,
      value: Object.freeze(__meta__),
    });

    /* Register */
    this.#_.registry.set(key, cls);

    return cls;
  }

  get(key) {
    return this.#_.registry.get(key);
  }

  has(key) {
    return this.#_.registry.has(key);
  }

  values() {
    return this.#_.registry.values();
  }
})();
