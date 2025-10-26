export function getScrollable(target) {
  let parent = target.parentElement;
  while (parent && parent !== document.body) {
    const style = getComputedStyle(parent);
    const canScrollY = /(auto|scroll)/.test(style.overflowY);
    const isScrollable = parent.scrollHeight > parent.clientHeight;
    if (canScrollY && isScrollable) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return window; // fallback
}

export function toTop(target) {
  const scrollable = getScrollable(target);
  scrollable.scrollTo({ top: 0, behavior: "smooth" });
  
}
