import { ComponentPublicInstance } from "vue";
import { ShapeFlags } from "@vue/shared";

export interface AnimateOptions {
  delay?: number;
  easing?: string;
  duration?: string;
}

const percentageKeywordMap = {
  end: 1.0,
  half: 0.5,
  quarter: 0.25,
  start: 0.0,
};

export function animate(animationClass: string, options: AnimateOptions = {}) {
  const delay = options.delay || 0;

  const classes = ["animated", animationClass];
  options.easing && classes.push("easing-" + options.easing);
  options.duration && classes.push("duration-" + options.duration);

  return function (el: HTMLElement) {
    setTimeout(() => {
      el.classList.add(...classes);
      // Shows the element now that the animation is starting
      el.style.opacity = "";
    }, delay);
  };
}
export function animateIn(
  animationClass: string,
  options: AnimateOptions = {}
) {
  return animate(animationClass, { easing: "decelerate", ...options });
}
export function animateOut(
  animationClass: string,
  options: AnimateOptions = {}
) {
  return animate(animationClass, { easing: "accelerate", ...options });
}

type IntersectionHandler = (el: HTMLElement) => void;

// v-intersection helpers
export function whenPastPercentage(
  percentage: number,
  intersectionHandler: IntersectionHandler
) {
  return {
    handler: function (entry: IntersectionObserverEntry) {
      entry.isIntersecting && intersectionHandler(entry.target as HTMLElement);
    },
    cfg: { threshold: percentage },
  };
}
export function whenPastEnd(intersectionHandler: IntersectionHandler) {
  return whenPastPercentage(1, intersectionHandler);
}
export function whenPastHalf(intersectionHandler: IntersectionHandler) {
  return whenPastPercentage(0.5, intersectionHandler);
}
export function whenPastQuarter(intersectionHandler: IntersectionHandler) {
  return whenPastPercentage(0.25, intersectionHandler);
}
export function whenPastStart(intersectionHandler: IntersectionHandler) {
  return whenPastPercentage(0.0, intersectionHandler);
}
export function whenPast(
  percentageOrKeyword: number | keyof typeof percentageKeywordMap,
  intersectionHandler: IntersectionHandler
) {
  if (
    typeof percentageOrKeyword !== "number" &&
    typeof percentageOrKeyword !== "string"
  ) {
    throw new Error("A keyword or percentage must be provided");
  }

  if (
    typeof percentageOrKeyword === "string" &&
    !Object.keys(percentageKeywordMap).includes(percentageOrKeyword)
  ) {
    throw new Error(
      "Keyword must be one between " +
        Object.keys(percentageKeywordMap).join(", ")
    );
  }

  const percentage =
    typeof percentageOrKeyword === "string"
      ? percentageKeywordMap[percentageOrKeyword]
      : percentageOrKeyword;

  return whenPastPercentage(percentage, intersectionHandler);
}

// Taken from https://github.com/vuejs/test-utils/blob/1b35e75868025ab1925c15208c55580e52b27326/src/vueWrapper.ts#L67
function getComponentRoot(vm: ComponentPublicInstance): HTMLElement {
  // if the subtree is an array of children, we have multiple root nodes
  const hasMultipleRoots = vm.$.subTree.shapeFlag === ShapeFlags.ARRAY_CHILDREN;
  return hasMultipleRoots ? vm.$el : vm.$el.parentElement;
}

export function hideAnimatableElements(vm: ComponentPublicInstance) {
  const element = getComponentRoot(vm);
  element.querySelectorAll<HTMLElement>("[data-animate]").forEach((el) => {
    el.style.opacity = "0";
  });
}
