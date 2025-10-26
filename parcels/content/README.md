# About
The 'content' parcel exposes the 'content' function and is tightly coupled with the 'content' build tool.
The 'content' build tool wraps content slices (html parsed from frontmatter md) into individual micro sheets.
Retrieval is slightly less performant than the approach taken for the code bundle but allows for an infinitely large content mass without making a dent in perf. Accordingly, the 'content' function does not cache retrieved content. Consuming code can do that, if so desired.

While content building and retrieval is inherently separate from the core import engine, the 'content' parcel
implements a type handler to provide seemless content access from 'use'.
