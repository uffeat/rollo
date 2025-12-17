/*
/basics.test.js
*/

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");
const { Papa } = await use("@/papa");

export default async () => {
  const csv = `
A,B,C
1-A,1-B,1-C
2-A,2-B,2-C
3-A,3-B,3-C
`;

  const result = Papa.parse(csv);

  console.log("result:", result);
};
