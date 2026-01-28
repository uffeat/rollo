/* NOTE Typically, the 'routes' parcel contains all routes and simply running 
'setup' suffices. However, since parcels are not Reat-aware, if a route uses React,
routes should be progressively enhanced at app point. This shows how to do that. */ 

import "@/use";
import "./routes/articles";

const { component } = await use("@/rollo/");
const { Nav, NavLink, router, Route } = await use("@/router/");
const { frame } = await use("@/frame/");
const { nav, setup } = await use("@/routes/");

/* Complete router setup */
await setup();
