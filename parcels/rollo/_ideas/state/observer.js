const options = {
  childList: true,
  subtree: false, // or true
};

const predicate = (node, action = {}) => {
  /* Do some check and return Boolean */
}

const observer = new MutationObserver((records, observer) => {
  for (const record of records) {
    // Check for additions
    for (const node of record.addedNodes) {
      if (predicate(node, {added: true})) {
        /* Set state (or do that in predicate) */
      }
    }
    // Check for removals
    for (const node of record.removedNodes) {
      if (predicate(node, {removed: true})) {
        /* Set state (or do that in predicate) */
      }
    }
  }
});

const target = document.body // Likely some component, perhaps app?

observer.observe(target, options);
