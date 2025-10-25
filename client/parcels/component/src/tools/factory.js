import { Parse } from "./parse.js";

/* Returns instance factory function.
NOTE
- cls can be a component class (or other constructor function) or a component 
instance. */
export const factory = (cls) => {
  return (...args) => {
    /* Parse args */
    args = new Parse(args);

    const instance = typeof cls === "function" ? new cls(args) : cls;

    /* Call '__new__' to invoke pre-config actions */
    instance.constructor.__new__?.call(instance, args);
    instance.__new__?.(args);
    /* Add CSS classes */
    if (instance.classes) {
      instance.classes.add(args.classes);
    }
    /* Use updates */
    instance.update?.(args.updates);
    /* Add text */
    if (args.text) {
      instance.insertAdjacentText("afterbegin", args.text);
    }
    /* Append children */
    instance.append?.(...args.children);
    /* Call '__init__' to invoke post-config actions */
    instance.__init__?.(args);
    instance.constructor.__init__?.call(instance, args);
    /* Call hooks */
    if (args.hooks) {
      const deferred = [];
      args.hooks.forEach((h) => {
        const result = h.call(instance, instance);
        if (typeof result === "function") {
          deferred.push(result);
        }
      });
      if (deferred.length) {
        setTimeout(() => {
          deferred.forEach((h) => h.call(instance, instance));
        }, 0);
      }
    }

    return instance;
  };
};
