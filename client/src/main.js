/* Initialize import engine and load main sheet (with Tailwind) */
import "@/main.css";
import "@/use";
import home from "@/routes/home/index";

const { component, Nav, NavLink, router } = await use("@/rollo/");
const { frame } = await use("@/frame/");

/* Define routes */
for (const [path, mod] of Object.entries(
  import.meta.glob("./routes/**/index.js", { eager: true, import: "default" })
)) {
  router.routes.add(`/${path.split("/").at(-2)}`, mod);
}
router.routes.add("/", home);

/* Create nav */
Nav(
  component.nav(
    "nav router flex flex-col gap-y-1 p-1",
    { slot: "side", parent: frame },
    ...[
      ["/about", "About"],
      ["/blog", "Blog"],
      ["/articles", "Articles"],
      ["/terms", "Terms"],
    ].map(([path, text]) => {
      return NavLink("nav-link", {
        text,
        path,
        title: text,
      });
    })
  ),
  /* Pseudo-argument for code organization */
  NavLink(
    { path: "/", parent: frame, slot: "home", title: "Home" },
    async function () {
      this.innerHTML = await use("/favicon.svg");
    }
  )
);

/* Complete router setup */
await router.setup({
  error: (() => {
    const page = component.main(
      "container",
      component.h1({ text: "Page not found" })
    );
    const details = component.p({ parent: page });
    return (message) => {
      if (message) {
        if (message instanceof Error) {
          message = message.message;
        }

        details.text = message;
      } else {
        details.clear();
      }
      frame.clear(":not([slot])");
      frame.append(page);
    };
  })(),
});

if (import.meta.env.DEV) {
  /** DEV testbench */

  /* Returns function that runs test from path */
  const run = (() => {
    const START = "../test/tests".length;
    const loaders = Object.fromEntries(
      Object.entries({
        ...import.meta.glob("../test/tests/**/*.test.js"),
      }).map(([k, v]) => {
        return [k.slice(START), v];
      })
    );
    use.sources.add("tests", async ({ path }) => {
      if (!(path.path in loaders)) {
        throw new Error(`Invalid path:${path.full}`);
      }
      return await loaders[path.path]();
    });
    return async (path) => {
      const asset = await use(`tests${path}`);
      await asset.default();
    };
  })();

  /* Trigger test from shortcut */
  (() => {
    const KEY = "__test__";
    window.addEventListener(
      "keydown",
      (() => {
        return async (event) => {
          /* Unit tests */
          if (event.code === "KeyU" && event.shiftKey) {
            const path = prompt("Path:", localStorage.getItem(KEY) || "");
            localStorage.setItem(KEY, path);
            await run(path);
          }
        };
      })()
    );
  })();
} else {

  await (async () => {
    const submission = 41
    const response = await fetch(`/api/anvil?name=echo&submission=${submission}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ foo: 42, bar: true }),
    });
    const result = await response.json();
    console.log("result:", result);
  })();

  await (async () => {
    const submission = 44
    const response = await fetch(`/api/anvil?name=echo&submission=${submission}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ foo: false, bar: 'BAR' }),
    });
    const result = await response.json();
    console.log("result:", result);
  })();
  
  

 
}
