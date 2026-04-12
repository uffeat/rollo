const use = globalThis.use;

const { component, css } = await use("@/rollo/");

const frame = document.getElementById("frame");

// Set up page nav
await (async () => {
  const nav = component.nav(
    "nav.d-flex.flex-column",
    { parent: frame, slot: "side" },
    component.a("nav-link", {
      text: "About",
      "[path]": "@@/about/",
    }),
    component.a("nav-link", {
      text: "Plot",
      "[path]": "@@/plot/",
      _args: [
        {
          Bar: {
            name: "Wonder Land",
            x: [2019, 2020, 2021, 2022, 2023],
            y: [510, 620, 687, 745, 881],
          },
        },
      ],
    }),
  );

  nav.on.click(async (event) => {
    event.preventDefault();
    if (!event.target.hasAttribute("path")) {
      return;
    }
    const previous = nav.querySelector(`a.disabled`);
    if (previous) {
      previous.class.disabled = false;
    }
    event.target.class.disabled = true;
    const path = event.target.attribute.path;
    //console.log("path:", path); ////
    const args = event.target._args || [];
    //console.log("args:", args); ////
    const target = await use(path, {test: true});
    const result = target(...args);
  });
  // Home nav
  frame
    .querySelector(`a[slot="home"]`)
    .addEventListener("click", async (event) => {
      event.preventDefault();
      const previous = nav.querySelector(`a.disabled`);
      if (previous) {
        previous.class.disabled = false;
      }
      (await use("@@/home/"))();
    });
})();

// Set up user nav
await (async () => {
  const user = await use("assets/user/", {
    test: true,
  });

  const login = component.a("nav-link.link-light", {
    text: "Log in",
    _action: "Login",
  });

  const logout = component.a("nav-link.link-light", {
    text: "Log out",
    _action: "Logout",
  });

  const signup = component.a("nav-link.link-light", {
    text: "Sign up",
    _action: "Signup",
  });

  const nav = component.nav(
    "nav.d-flex",
    { parent: frame, slot: "top" },
    login,
    signup,
    logout,
  );

  nav.on.click(async (event) => {
    event.preventDefault();
    if (!event.target._action) {
      return;
    }
    await user[event.target._action]();
  });

  user.user.effects.add((current) => {
    logout.classes.if(!current, "d-none");
    login.classes.if(current, "d-none");
    signup.classes.if(current, "d-none");
  });
})();

export default async (node) => {
  //console.log("node:", node); ////
};

//uffeat@gmail.com
