/*
/server/echo.test.js
*/
import { api, rpc } from "@/server";

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");

  const page = component.div("container.p-3", { parent: frame });

  await (async () => {
    const { data, meta } = await api.echo({ ding: 42, dong: true, foo: "FOO" });
    console.log("data:", data);
    console.log("meta:", meta);
  })();

  /*
await (async () => {
  const { data, meta } = await rpc.echo({ ding: 42, dong: true, foo: "FOO" });
  console.log("data:", data);
  console.log("meta:", meta);
})();
*/
};
