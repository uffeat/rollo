# Current

- Rebasing takes place (by default) for both images and links. This is really great for images, but typically breaks re router links. This means that correct handling of links typically requires post-processing. Even if rebasing could be configured to only apply to images, post-processing for links would likely still be necessary... Not sure how to handle this best, but options include:
- Accept post-processing, perhaps via a helper in this parcel, perhaps as an option in `use`. Could involve direct use of html tags in MD, could involve a special web component (with reflection) for this purpose. Or perhaps `directives` could offer a solution?
- Avoid using links in runtime-transpiled MD; perhaps OK, since intended for light-weight cases.
- Use `new Marked()` + custom setup without rebasing + some post-processing as discussed above.

# Experiments

- Explore directives.
- Direct use of autonomous web components is an options (provided reflection). Explore options for auto-injection of non-autonomous web components in a way that also works in Safari. Perhaps I already have the solution with `component.from`?
- Explore additional extensions, e.g. for
  - emoji's
  - footnotes
  - tables
- Further alignment of this parcel + import engine with build tools (possibly refactoring parcel, import engine and build tools).
