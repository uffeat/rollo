/*
server/echo.js
*/

export default async () => {
  const { frame } = await use("@/frame/");
  const { server } = await use("@/server");
  const { Exception, match } = await use("@/rollo/");
  const dto = [
    { yes: true, no: false, number: 1, text: crypto.randomUUID() },
    [crypto.randomUUID(), 0, 1, true, false, null],
  ];
  const { result: _dto, meta } = await server.echo(dto[0], ...dto[1]);
  Exception.if(!match(dto, _dto), `Server connection could not be verified.`);
  console.info("Server connection verified for:", meta);
};
