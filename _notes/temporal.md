`npm install @js-temporal/polyfill`

... If from config, also:

`npm install @rollup/plugin-inject --save-dev`

If not the above config, then in the app:
`import { Temporal } from '@js-temporal/polyfill';`
