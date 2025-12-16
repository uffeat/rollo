import "@/use";
import home from "./home";
import error from "./error";

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
  error,
});
