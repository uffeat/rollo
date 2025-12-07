# About

Page (route) for the blog "publication".

## Rendering and static asset retrival

The parcel renders from built static MD assets (Frontmatter-style).

Ideal situation:

1. The parcel size is small (being a parcel, already not part of the bundle).
2. Import of the parcel (module) should not block the app.
3. The user should not experience uncomplete components and style flickering at first page load.

To get close to this ideal situation, the parcel renders at first page load. This makes parcel import non-blocking, but risks a dodgy first page-load. To mitigate this, we...

- render at route entry, i.e., slightly before page display
- retrieve the built static MD assets from the asset carrier sheet, which is super fast.

The content is retrieved as json. This is similar to server-provided content (easy switching), but does require some rendering.

## Discussion and alternative approaches

I would prefer not to "pollute" the asset carrier sheet with content, but it's the price to pay for super fast imports. I have made working solutions that start static asset public imports and rendering in non-blocking 'then' scopes at module import - and has the ability to switch to async/await if content is requested prematurely. This does keep content out of the asset carrier sheet. However, the code for this is pretty gnarly and perhaps a bit too magical? The success of the solution also depends on, when the user chooses to visit the page. If done early, there's a real risk of either blocking or half-baked components; could be mitigated with placeholders and progressive images, but that would complicate things even further...

Yet another alternative could be to build to a dedicated content carrier sheet. Conceptually, that would be similar to the current solution - only with a cleaner asset-content separation. On the other hand, such a move would mean even heavier build tooling - and compared to the stuff already in the asset carrier sheet, even large content volumes would still be comparatively small.

When considering alternatives, it's important to discriminate between import of paths and actual content (and rendering of that). Regardless of the solution, import of paths is required before content import and rendering can take place. Some of my previous solution imported paths and content separately, while the current solution imports everything in one bit json chunck. This is certainly simplest, but perhaps some perf gains could be achieved with separate import - perhaps without the need to parse json, i.e., paths directly as constructed modules (or would that be even heavier than json parsing?). I've also experimented with Jinja-powered buildtime rendering, but saw no real performance gains, espcially since some post-processing at runtime is still required.

Once I develop my "space" concept (local iframes) one option could also be to relegate some of the work to such a space at parcel import... Other completely different future solution could be:
- Let a separate Asto app deal with content... 
- Classic MPA for content; perhaps Flask or Anvil teaked to behave Flak-like.
...but in such cases I'd need to consider "inter app coms".

In summary, the combination of rendering at page request and retrieval of content from the asset carrier sheet does seem to work well. I may, however I revert to some of the alternatives solutions in future for React-based pages. These do not lend temselves to the the parcel concept and will live in the main bundle. And since content should never enter the actual bundle some hybrid solution is called for: Perhaps path and meta data injected into the bundle or asset-carrier sheet (by my build tool) and then a some variation of "background" content retrieval and rendering.
