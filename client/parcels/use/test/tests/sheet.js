/*
sheet.js
*/
const { component } = await use("/component.js");

export default async () => {
  const sheet = await use("/test/foo.css", {
    callback: (...args) => console.log("callback got:", ...args),
  });

  return sheet;
};
