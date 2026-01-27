import "@/use";

import './routes/articles'

const { component } = await use("@/rollo/");
const { Nav, NavLink, router } = await use("@/router/");
const { frame } = await use("@/frame/");
const { Route, nav, setup } = await use("@/routes/");



/* Complete router setup */
await setup();
