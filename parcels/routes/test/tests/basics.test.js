/* 
/basics.test.js
*/

const { component, router } = await use("@/rollo/");
const { Route, nav, setup } = await use("@/routes/");

export default async () => {
  const route = Route.create({
    page: component.main("container pt-3", component.h1({ text: "Foo" })),
    path: "/foo",
    text: "Foo",
  });

  router.routes.add(route.path, route);

  nav.append(route.link);

  await setup()
};
