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

    if (use.meta.DEV) {
      /* XXX Something odd is going on, when testing parcels: Components get
      registered multiple times!
      Perhaps a failed cache, perhaps an in-flight issue or some other kind of 
      race condition? Perhaps a bug in the component's parcel? Perhaps due
      to the way the import engine is initialized inside parcels?
      This is a hack - not a solution... On the positive side, the issue only 
      pertains to testing (does not occur, when using the built parcel).
      NOTE Cannot use 'this.#_.registry' since the
      dev context may have recreated it. Use 'customElements', which of course
      assumes dev work NOT done in Safari (as if...) */
      const current = customElements.get(key);
      if (current) {
        console.warn(`Ignored attempt to re-register:`, key);////
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
        //console.info(`Defined '${key}' component extended from '${native}'.`);////
      } else {
        //console.info(`Defined '${key}' component.`);////
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
