import { useEffect, useRef } from "react";

/* Appends elements to the element ref of the React component, in which this 
hook in called. Returns an element ref of the React component. This ref must 
be set as the React component's ref prop, e.g.: ref={ref} */
export const appendHook = (...elements) => {
  const ref = useRef();

  useEffect(() => {
    const parent = ref.current;
    for (const element of elements) {
      /* Guard against duplicate append (especially relevant in StrictMode) */
      if (parent.contains(element)) continue;
      parent.append(element);
    }
  }, []);

  return ref;
}
