# Do
- 'sheet' proxy version
- Explore usage in combo with breakpoint from app.
- Better removal of rules via index function
- Self-contained special sheet type (or function) for defining a single animation.
- Event hook when sheets in use. Target doc, window as fallback if not find data-use/#use component
- Control of keyframes names and their application

# Ideas
- build tool and/or 'use' integration
- Automatic sheet loading when importing certain components.
- Named rules for fast dynamic rule control. Could be authored in html files with instructions in meta and/or script tags. Could moreover, embed JS functions/modules (base64) in css, which in turn could interact with dynamic rule control.
- CSS values can be a function -> interpreted as an effect
- Simple scoping, perhaps by wrapping the sheet in a single nested rule?
- Light weight sheet companion component: When dropped in an element, it is inferred if in shadow or not and sheet is added accordingly. If dropped in component with a 'scope' prop/att, a scoped version of the sheet is applied.
