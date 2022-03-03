import { getCurrentInstance, onMounted } from "vue";
import {
  animationFns,
  hideAnimatableElements,
  insersectionFns,
} from "../internals";

export function useAnimate() {
  const vm = getCurrentInstance()?.proxy!;

  onMounted(() => {
    hideAnimatableElements(vm);
  });

  return {
    ...animationFns,
    ...insersectionFns,
  };
}

export default useAnimate;
