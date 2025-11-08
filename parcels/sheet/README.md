The 'sheet' parcel provides the central 'Sheet' class. It is an extension of the native CSSStyleSheet with features for
- Controlled adoption/unadoption
- Light-weight dynamic rule control

Also includes the optional tools for less "stringy" rule authoring in JS. While these tools do work, they are emerging and somewhat experimental. Should probably only be used in tests.

# Notes
- The dynamic rule control is "non-invasive" in the sense that it does not bloat 'Sheet'; 
- Dynamic rule control supports CSSStyleRule, CSSMediaRule, and CSSKeyframesRule. Should be adequate for most cases.
