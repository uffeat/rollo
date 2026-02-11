import "../../use";
import { user } from "../user";

const { component } = await use("@/rollo/");
const { modal } = await use("@/modal/");
const { Spinner } = await use("/tools/spinner");

export const Logout = async () => {
  const content = (host) => {
    host.tree.content.attribute.user = true;

    host.tree.footer.on.click(async (event) => {
      if (event.target?.tagName !== "BUTTON") {
        return;
      }
      if (event.target.attribute.logout) {
        const result = await Spinner.while(
          { parent: host.tree.content, size: "6rem" },
          async () => {
            return await user.logout();
          },
        );

        host.close(result);
      } else {
        host.close();
      }
    });
    return component.p({
      text: "Do you wish to log out?",
    });
  };

  const confirmed = await modal(
    { content, title: "Log out" },
    component.button(".btn.btn-primary", {
      text: "Yes",
      "[logout]": true,
    }),
    component.button(".btn.btn-secondary", {
      text: "No",
    }),
  );
  if (confirmed) {
    return await user.logout();
  }
};
