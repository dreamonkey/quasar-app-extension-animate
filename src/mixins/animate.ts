import { ComponentPublicInstance } from "vue";
import {
  animationFns,
  getComponentRoot,
  hideAnimatableElements,
  insersectionFns,
} from "../internals";

export default {
  mounted(this: ComponentPublicInstance) {
    const element = getComponentRoot(this);
    hideAnimatableElements(element);
  },
  methods: {
    ...animationFns,
    ...insersectionFns,
  },
};
