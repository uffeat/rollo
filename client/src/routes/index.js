import "@/use";

import './routes/articles'

const { component, Nav, NavLink, router } = await use("@/rollo/");
const { frame } = await use("@/frame/");
const { Route, nav, setup } = await use("@/routes/");



/* Complete router setup */
await setup();
