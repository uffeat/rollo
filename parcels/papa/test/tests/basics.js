/*
basics.js
*/


const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");
const { Sheet, css } = await use("@/sheet.js");


export default async ({ Papa }) => {
    const csv = `
A,B,C
1-A,1-B,1-C
2-A,2-B,2-C
3-A,3-B,3-C
`;

  const result = Papa.parse(csv);

  console.log("result:", result);
};
