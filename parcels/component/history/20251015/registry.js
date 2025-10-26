import "../../use.js";

export const registry = new (class {
  #_ = {
    registry: new Map(),
  };

  add(cls, key, native) {
    if (key) {
      /* Patch-on __key__ */
      Object.defineProperty(cls, "__key__", {
        configurable: false,
        enumerable: true,
        writable: false,
        value: key,
      });
    } else {
      /* Get 'key' from cls if not provided */
      key = cls.__key__;
    }

    if (native) {
      /* Patch-on __native__ */
      Object.defineProperty(cls, "__native__", {
        configurable: false,
        enumerable: true,
        writable: false,
        value: native,
      });
    } else {
      /* Get 'native' from cls if not provided */
      native = cls.__native__;
    }

    if (import.meta.env.DEV) {
      /* In DEV, test scripts may attempt double registration, which (in DEV) 
      should be ignored. NOTE Cannot use 'this.#_.registry' since the
      dev context may have recreated it. Use 'customElements', which of course
      assumes dev work NOT done in Safari (as if...) */
      const current = customElements.get(key);
      if (current) {
        console.log(
          `Fending off double registration of component with key:`,
          key
        );
        return current;
      }
    }

    /* Prepare definition args */
    const definition = [key, cls];
    if (native) {
      definition.push({ extends: native });
    }
    /* Define */
    customElements.define(...definition);

    if (use.meta.DEV) {
      if (native) {
        console.info(`Defined '${key}' component extended from '${native}'.`);
      } else {
        console.info(`Defined '${key}' component.`);
      }
    }

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
    /* NOTE Since meta data is patched on to cls, components can be redefined in 
    another document from 'values'. */
    return this.#_.registry.values();
  }
})();
