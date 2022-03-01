import {
  animationFns,
  hideAnimatableElements,
  insersectionFns,
} from '../internals';

export default {
  mounted(this: { $el: HTMLElement }) {
    hideAnimatableElements(this.$el);
  },
  methods: {
    ...animationFns,
    ...insersectionFns,
  },
};
