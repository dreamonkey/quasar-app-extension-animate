import { getCurrentInstance, onMounted } from "vue";
import {
  animationFns,
  getComponentRoot,
  hideAnimatableElements,
  insersectionFns,
} from "../internals";

export function useAnimate() {
  const vm = getCurrentInstance()?.proxy!;

  onMounted(() => {
    const element = getComponentRoot(vm);
    hideAnimatableElements(element);
  });

  return {
    ...animationFns,
    ...insersectionFns,
  };
}

export default useAnimate;
