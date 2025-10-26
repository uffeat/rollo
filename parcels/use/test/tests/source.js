/*
source.js
*/
const { component } = await use("/component.js");

export default async () => {
  const result = await use("@/echo/");
  console.log('result:', result)

 
};
