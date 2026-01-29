import "../use";
import "../assets/modal.css";

const { Modal } = await use("@/bootstrap/");
const { component } = await use("@/rollo/");

export const modal = async ({
  content = "",
  centered,
  dismissible = true,
  effects = [],
  fade = true,
  scrollable,
  size,
  style,
  tag = "div",
  title = "",
}) => {

  
  const host = component.div(`.modal${fade ? ".fade" : ""}`, {
    parent: document.body,
  });
};
