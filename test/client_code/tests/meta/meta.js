/*
meta/meta.js
*/

export default async () => {
  const meta = await use("@@/meta/");
  console.log("meta.env:", meta("env"));
  console.log("meta.bad:", meta("bad?"));
  meta("bad?", 42);
};
