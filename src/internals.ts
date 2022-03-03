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

function animate(animationClass: string, options: AnimateOptions = {}) {
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
function animateIn(animationClass: string, options: AnimateOptions = {}) {
  return animate(animationClass, { easing: "decelerate", ...options });
}
function animateOut(animationClass: string, options: AnimateOptions = {}) {
  return animate(animationClass, { easing: "accelerate", ...options });
}

type IntersectionHandler = (el: HTMLElement) => void;

// v-intersection helpers
function whenPastPercentage(
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
function whenPastEnd(intersectionHandler: IntersectionHandler) {
  return whenPastPercentage(1, intersectionHandler);
}
function whenPastHalf(intersectionHandler: IntersectionHandler) {
  return whenPastPercentage(0.5, intersectionHandler);
}
function whenPastQuarter(intersectionHandler: IntersectionHandler) {
  return whenPastPercentage(0.25, intersectionHandler);
}
function whenPastStart(intersectionHandler: IntersectionHandler) {
  return whenPastPercentage(0.0, intersectionHandler);
}
function whenPast(
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

export function hideAnimatableElements(element: HTMLElement) {
  element.querySelectorAll<HTMLElement>("[data-animate]").forEach((el) => {
    el.style.opacity = "0";
  });
}

// Taken from https://github.com/vuejs/test-utils/blob/1b35e75868025ab1925c15208c55580e52b27326/src/vueWrapper.ts#L67
export function getComponentRoot(vm: ComponentPublicInstance): HTMLElement {
  // if the subtree is an array of children, we have multiple root nodes
  const hasMultipleRoots = vm.$.subTree.shapeFlag === ShapeFlags.ARRAY_CHILDREN;
  return hasMultipleRoots ? vm.$el : vm.$el.parentElement;
}

export const animationFns = { animate, animateIn, animateOut };
export const insersectionFns = {
  whenPastPercentage,
  whenPastEnd,
  whenPastHalf,
  whenPastQuarter,
  whenPastStart,
  whenPast,
};
