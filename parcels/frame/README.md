# About 
Layout singleton web component.


# Notes
- Transition time is set/unset at each transition cycle to prevent flicke.
- In practice, `frame` is pretty central to `Rollo` and could therefore have been part of the `rollo` parcel. However, `rollo` should be zero dep, and `frame` does use Bootstrap's `reboot`... It's a borderline case and it could be argued that `reboot` should not count as a dep...