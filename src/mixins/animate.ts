import { ComponentPublicInstance } from "vue";
import { hideAnimatableElements } from "../shared";

export default {
  mounted(this: ComponentPublicInstance) {
    hideAnimatableElements(this);
  },
};
