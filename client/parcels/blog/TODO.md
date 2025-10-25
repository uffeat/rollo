# IMPORTANT

Give each blog card path that when set imports content and renders. Could be

- an async method
- an async setter (patch onto prototype)
- an async connectedCallback
  ... or non async with then...
- and event handler on head, document or window. Requires refactoring of Content, so that an event is emitted.

Perhaps cache on element

# Progressive rendering

Some kind of progressive rendering of blog...

## Ideas

- Delegate progressive content "fetching" to a data layer. This data layer progressively imports, stores and "streams" to blog, which in itself does not store data.
- blog owns its data, incl. storage and progressive import. Perhaps blog is only rendered once and then hidden/shown. Rendering could be controlled by an intersection observer?
