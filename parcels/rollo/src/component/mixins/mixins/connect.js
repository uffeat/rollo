export default (parent, config) => {
  return class extends parent {
    static __name__ = "connect";
    #_ = {};

    connectedCallback() {
      super.connectedCallback?.();
      this.#_.onConnect?.(this);
      this.dispatchEvent(new CustomEvent("_connect"));
      this?.$({ _connect: true });
    }

    disconnectedCallback() {
      super.disconnectedCallback?.();
      this.#_.onDisconnect?.(this);
      this.dispatchEvent(new CustomEvent("_disconnect"));
      this?.$({ _connect: false });
    }

    onConnect(onConnect) {
      if (onConnect) {
        this.#_.onConnect = onConnect.bind ? onConnect.bind(this) : onConnect;
        if (this.isConnected) {
          this.#_.onConnect();
        }
      } else {
        delete this.#_.onConnect;
      }
      return this;
    }

    onDisconnect(onDisconnect) {
      if (onDisconnect) {
        this.#_.onDisconnect = onDisconnect.bind
          ? onDisconnect.bind(this)
          : onDisconnect;
      } else {
        delete this.#_.onDisconnect;
      }
      return this;
    }
  };
};
