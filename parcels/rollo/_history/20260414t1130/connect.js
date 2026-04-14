export default (parent, config) => {
  return class extends parent {
    static __name__ = "connect";

    connectedCallback() {
      super.connectedCallback?.();
      this.dispatchEvent(new CustomEvent("_connect"));
    }

    disconnectedCallback() {
      super.disconnectedCallback?.();
      this.dispatchEvent(new CustomEvent("_disconnect"));
    }
  };
};
