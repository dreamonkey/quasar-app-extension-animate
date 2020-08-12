import {
  hideAnimatableElements,
  animationFns,
  insersectionFns,
} from "../composables/animate";

export default {
  mounted(this: { $el: HTMLElement }) {
    hideAnimatableElements(this.$el);
  },
  methods: {
    ...animationFns,
    ...insersectionFns,
  },
};
