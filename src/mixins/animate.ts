import { ComponentPublicInstance } from "vue";
import {
  animationFns,
  hideAnimatableElements,
  insersectionFns,
} from "../internals";

export default {
  mounted(this: ComponentPublicInstance) {
    hideAnimatableElements(this);
  },
  methods: {
    ...animationFns,
    ...insersectionFns,
  },
};
