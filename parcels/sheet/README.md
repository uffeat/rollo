The 'sheet' parcel provides the central 'Sheet' class. It is an extension of the native CSSStyleSheet with features for
- Controlled adoption/unadoption
- Light-weight dynamic rule control

Also includes the small 'css' tool, which makes working with rules in JS slightly less "stringy".


# Notes
- The dynamic rule control is "non-invasive" in the sense that it does not bloat 'Sheet'; 
- Dynamic rule control supports CSSStyleRule, CSSMediaRule, and CSSKeyframesRule. Should be adequate for most cases.
- To experiment, I've made extensive use of bindable functions as an alternative to class methods. It improves portability and results in shorter modules.