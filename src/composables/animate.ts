import { onMounted, Ref } from "vue";
import {
  animationFns,
  hideAnimatableElements,
  insersectionFns,
} from "../internals";

export function useAnimate(hostRef: Ref<HTMLElement>) {
  onMounted(() => hideAnimatableElements(hostRef.value));

  return {
    ...animationFns,
    ...insersectionFns,
  };
}

export default useAnimate;
