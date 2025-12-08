import "@/use.js";

export default async () => {
  return {
    reboot: await use("@/bootstrap/reboot.css"),
    shadow: import.meta.env.DEV
      ? await use(`/assets/blog/shadow.css`, { as: "sheet" })
      : await use(`@/blog/shadow.css`),
  };
};


