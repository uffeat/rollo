/*
client/user/custom_user.js
*/

const { component, is, css, ref } = await use("@/rollo/");
const { frame } = await use("@/frame/");
const rpc = await use("@@/tools:rpc");

export default async () => {
  const menu = component.menu('.d-flex.gap-3.p-3',{ parent: frame });

  await (async () => {
    const button = component.button({ parent: menu, text: "Get user" });
    button.on.click(async (event) => {
      const result = await rpc.get_user();
      console.log("result:", result);
    });
  })();

  await (async () => {
    const button = component.button({ parent: menu, text: "Log out" });
    button.on.click(async (event) => {
      const result = await rpc.logout_user();
      console.log("result:", result);
    });

  })();

  await (async () => {})();
};

//uffeat@gmail.com
