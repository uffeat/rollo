export default (parent, config) => {
  return class extends parent {
    static __name__ = "hook";

    hook(hook) {
      return hook ? hook.call(this) ?? this : this;
    }
  };
};
