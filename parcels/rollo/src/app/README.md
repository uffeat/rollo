# About 

## Breakpoints
Not used by 'app' itself, but provided as a service to enable:
- Programmatic reaction to breakpoint crossings, either directly with '$' 
  effects or with '_break_' handlers.
- Alternative to media queries in sheets.

Breakpoints follow Tailwind conventions, which are not identical to (but not far 
off) Bootstrap defaults:
{
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400, // Also different label
}
... Likely not an issue, just be aware.



## Resize observer
Not used by 'app' itself, but provided as a single general-purpose viewport 
resize observer that consuming code can access with '$' effects or with 
'_resize' handlers.

NOTE
Could have handled breakpoints (making a separate breakpoints util redundant),
but does not do that to maintain clear separation of concern and for ease of
maintenance. Also possible that breakpoint calculations inside the resize 
callback would hurt performance.