import { getCurrentInstance, onMounted } from "vue";
import { hideAnimatableElements } from "../shared";

export function useAnimate() {
  const vm = getCurrentInstance()?.proxy!;

  onMounted(() => {
    hideAnimatableElements(vm);
  });
}

export default useAnimate;
