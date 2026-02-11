import "../use";

const { Ref } = await use("@/rollo/");

export const user = new (class User {
  #_ = {
    state: Ref.create(null),
  };

  constructor() {}

  get data() {
    return this.#_.state.current;
  }

  get effects() {
    return this.#_.state.effects;
  }

  async Login() {
    return await this.#_.Login();
  }

  async Logout() {
    return await this.#_.Logout();
  }

  async Reset() {
    return await this.#_.Reset();
  }

  async Signup() {
    return await this.#_.Signup();
  }

  async get() {
    return await this.#_.get();
  }

  async login(email, password) {
    return await this.#_.login(email, password);
  }

  async logout() {
    return await this.#_.logout();
  }

  async reset(email) {
    return await this.#_.reset(email);
  }

  async signup(email, password) {
    return await this.#_.signup(email, password);
  }

  async setup({
    Login,
    Logout,
    Reset,
    Signup,
    change,
    get,
    login,
    logout,
    reset,
    signup,
  } = {}) {
    if (Login) {
      this.#_.Login = async () => {
        const data = await Login();
        //console.log("data:", data); ////
        if (data) {
          this.#_.state.update(data);
        }
        return data;
      };
    }

    if (Logout) {
      this.#_.Logout = async () => {
        const result = await Logout();
        if (result) {
          this.#_.state.update(null);
        }
        return result;
      };
    }

    if (Reset) {
      this.#_.Reset = async () => {
        const confirmed = await Reset();
        //console.log("data:", data); ////
        if (confirmed) {
          this.#_.state.update(null);
        }
        return confirmed;
      };
    }

    if (Signup) {
      this.#_.Signup = async () => {
        const data = await Signup();
        //console.log("data:", data); ////
        if (data) {
          this.#_.state.update(data);
        }
        return data;
      };
    }

    if (get) {
      this.#_.get = async () => {
        const data = await get();
        this.#_.state.update(data || null);
        return data;
      };
      await this.get();
    }

    if (login) {
      this.#_.login = async (email, password) => {
        const data = await login(email, password);
        if (data.error) {
          this.#_.state.update(null);
        } else {
          this.#_.state.update(data);
        }
        return data;
      };
    }

    if (logout) {
      this.#_.logout = async () => {
        const result = await logout();
        this.#_.state.update(null);
        return result;
      };
    }

    if (reset) {
      this.#_.reset = async (email) => {
        const result = await reset(email);

        
        console.log("result from reset:", result); ////
        this.#_.state.update(null);
        return result;
      };
    }

    if (signup) {
      this.#_.signup = async (email, password) => {
        const data = await signup(email, password);
        if (data.error) {
          this.#_.state.update(null);
        } else {
          this.#_.state.update(data);
        }
        return data;
      };
    }
  }
})();
