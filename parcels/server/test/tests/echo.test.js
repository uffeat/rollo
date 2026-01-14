/* 
/echo.test.js
*/

const { Exception, match, component } = await use("@/rollo/");
const { frame } = await use("@/frame/");
const { server } = await use("@/server");

export default async () => {
  frame.clear(":not([slot])");

  const dto = [
    { yes: true, no: false, number: 1, text: crypto.randomUUID() },
    [crypto.randomUUID(), 0, 1, true, false, null],
  ];
  const { result: _dto, meta } = await server.echo(dto[0], ...dto[1]);
  Exception.if(!match(dto, _dto), `Server connection could not be verified.`);
  console.info("Server connection verified for:", meta);
};
