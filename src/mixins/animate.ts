import {
  hideAnimatableElements,
  animationFns,
  insersectionFns,
} from "../internals";

export default {
  mounted(this: { $el: HTMLElement }) {
    hideAnimatableElements(this.$el);
  },
  methods: {
    ...animationFns,
    ...insersectionFns,
  },
};
