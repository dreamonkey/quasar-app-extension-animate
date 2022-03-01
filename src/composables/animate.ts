import { onMounted, Ref } from 'vue';
import {
  animationFns,
  hideAnimatableElements,
  insersectionFns,
} from '../internals';

export function useAnimate(componentRef: Ref<HTMLElement> | undefined) {
  onMounted(() => {
    if (componentRef !== undefined && componentRef.value !== undefined) {
      hideAnimatableElements(componentRef.value);
    } else {
      console.warn(
        'Element not passed to useAnimate, you can get some errors while managing callbacks behaviors'
      );
    }
  });

  return {
    ...animationFns,
    ...insersectionFns,
  };
}

export default useAnimate;
