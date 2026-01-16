const state = ref(false);
  state.detail.threshold = 200;
  state.effects.add(
    (current) => {
      console.log('current:', current);
    },
    { run: false }
  );

  const debounce = (node) => {
    /* Clear any timer */
    if (state.detail.timer) {
      clearTimeout(state.detail.timer);
    }
    /* Create timer */
    state.detail.timer = setTimeout(() => {
      /* Set state */
      state(/* Some action here */);
      state.detail.timer = null;
    }, state.detail.threshold);
  };
