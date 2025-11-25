# About

Extension of the native CSSStyleSheet with features for controlled adoption/unadoption and light-weight dynamic rule control. Also includes the optional tools for less "stringy" rule authoring in JS.

# Notes

- The dynamic rule control is "non-invasive" in the sense that it does not bloat 'Sheet';
- Dynamic rule control supports CSSStyleRule, CSSMediaRule, and CSSKeyframesRule. Should be adequate for most cases.
