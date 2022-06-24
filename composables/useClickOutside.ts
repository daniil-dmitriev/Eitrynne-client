/**
 *
 * @param el_target_ref Root element for which clicking outside will trigger callback_fn
 * @param callback_fn Function that is called when user click outside of el_target_ref elemet
 */

export function useClickOutside(el_target_ref, callback_fn) {
  if (!el_target_ref) return;

  let listener = (e) => {
    if (
      e.target == el_target_ref.value ||
      e.composedPath().includes(el_target_ref.value)
    ) {
      // if clicked inside component region
      return;
    }

    if (typeof callback_fn == "function") {
      callback_fn();
    }
  };

  onMounted(() => {
    window.addEventListener("click", listener);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("click", listener);
  });

  return {
    listener,
  };
}
