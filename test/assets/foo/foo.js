const use = globalThis.use; // Silence linter

export default async () => {
  console.log("Do setup here");
};

if (use.meta.DEV) {
  (() => {
    const ECHO = "ECHO";
    for (const path of ["/echo", "@/echo", "assets/echo"]) {
      use(path).then(({ echo }) => {
        const result = echo(ECHO);
        if (result !== ECHO) {
          console.error(`Unexpected result from ${path}:`, result);
        }
        //console.log(`Result from ${path}:`, result); ////
      });
    }
  })();
}
