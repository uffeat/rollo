import "../use";

const { Ref } = await use("@/rollo/");
const { server } = await use("@/server");

export const user = new (class User {
  #_ = {
    state: Ref.create(null),
  };

  constructor() {
    if (use.meta.DEV) {
      this.setup({
        data: () => {
          return Object.freeze(
            JSON.parse(localStorage.getItem("user") || null),
          );
        },
        login: async (email, password) => {
          const { result } = await server.login(email, password);
          localStorage.setItem("user", JSON.stringify(result));
          return Object.freeze(result);
        },
      });
    }
  }

  get data() {
    return this.#_.state.data()
  }

  get effects() {
    return this.#_.state.effects;
  }

  async login(email, password) {
    return await this.#_.state.login(email, password);
  }

  setup({ data, login } = {}) {
    if (data) {
      this.#_.state.data = data;
    }
    if (login) {
      this.#_.state.login = login;
    }
  }
})();
