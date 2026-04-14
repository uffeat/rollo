export default (parent, config) => {
  return class extends parent {
    static __name__ = "connect";
    #_ = {};

    connectedCallback() {
      super.connectedCallback?.();
      this.#_.onConnect?.();
      this.dispatchEvent(new CustomEvent("_connect"));
    }

    disconnectedCallback() {
      super.disconnectedCallback?.();
      this.#_.onDisconnect?.();
      this.dispatchEvent(new CustomEvent("_disconnect"));
    }

    onConnect(onConnect) {
      if (onConnect) {
        this.#_.onConnect = onConnect.bind(this);
      } else {
        delete this.#_.onConnect;
      }
      return this;
    }

    onDisconnect(onDisconnect) {
      if (onDisconnect) {
        this.#_.onDisconnect = onDisconnect.bind(this);
      } else {
        delete this.#_.onDisconnect;
      }
      return this;
    }
  };
};
