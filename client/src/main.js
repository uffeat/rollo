/* Initialize import engine and load main sheet (with Tailwind) */
import "@/main.css";
import "@/use";
import "@/router";


import { rpc } from "@/server";


await (async () => {
    const { data } = await rpc.echo({ ding: 42, dong: true, foo: 'FOO' });
    console.log("data:", data);
  })();


if (import.meta.env.DEV) {
  await import('../test')
}