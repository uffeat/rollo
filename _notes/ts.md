npm i -D typescript

# If using React, also:

npm i -D @types/react @types/react-dom

> But all this is only relevant for linting and type-checking. No need if I just want to have .ts (and related) files with out breking anything.

# Re ts.config

target: "es2022"
Just tells TS what language level to assume when giving IntelliSense. No emit, so it is advisory only.

module: "EsNext"
Matches Vite’s ESM world. Again, mainly for editor / analysis.

moduleResolution: "Bundler"
This is the “Vite/modern bundler” option. It makes TS resolve imports in a way that better reflects what Vite does.

jsx: "react-jsx"
Lets .tsx (and optionally .jsx) files use the modern JSX transform (no need for React in scope). Good match for Vite + React.

allowJs: true
Important for you: JS files are part of the project. If you ever turn on checking later, TS will “see” your JS world too.

checkJs: false
Also important: TS does not try to type-check your .js files. So your dynamic JS tricks stay free and happy.

strict: false
No strict checking. You are using TS as a syntax host / occasional island, not as a strict contract enforcer.

noEmit: true
TS will never write .js files. Vite is the only thing touching your output.

isolatedModules: true
This keeps TS happy with the kind of per-file transforms that esbuild does. Helps avoid weird edge cases like enums / namespaces that don’t play well with bundlers.

resolveJsonModule: true
Lets you import foo from "./foo.json" in TS-land if you ever want that.

esModuleInterop: true
Makes common interop patterns (import x from "lib") behave the way you expect.

skipLibCheck: true
Skips checking of .d.ts from dependencies. Since you are not trying to be type-perfect, this keeps noise down.

"include": ["src"]
Keeps TS focus on your real code, not random config files.