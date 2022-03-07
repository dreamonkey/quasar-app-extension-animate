# Quasar animation system extension

This [App Extension(AE)](https://quasar.dev/app-extensions/introduction) simplifies the use of animations activated when elements show up on the screen.
It's meant to work with [Intersection Directive](https://quasar.dev/vue-components/intersection#Introduction).

All elements marked by a `[data-animate]` attribute will be hidden upon component mount and shown, with the animation you provide, once they come into view for a percentage you decide. You can also manage the animation delay, duration and easing via CSS classes or SCSS variables and functions.

## Install

Add the App Extension into your Quasar project

```bash
quasar ext add @dreamonkey/animate
```

This AE contains many variables and functions you can use to make your style definitions more readable and coherent.
It provides the most used durations and commonly used easing functions so import it in the SCSS variables file:

```scss
// src/css/quasar.variables.scss
@import "~@dreamonkey/quasar-app-extension-animate/dist/animations";
```

If using Options or Class API, register the mixin on all components using this AE features

```ts
import {
  AnimateMixin,
  animateIn,
  whenPastEnd,
} from "@dreamonkey/quasar-app-extension-animate";

export default {
  name: "AboutPage",
  mixins: [AnimateMixin],
  methods: {
    animateIn,
    whenPastEnd,
  },
};
```

If using Composition API, call the composable in all components using this AE features (aka every component which contains at least a `data-animate` attribute)

```ts
import {
  useAnimate,
  animateIn,
  whenPastEnd,
} from "@dreamonkey/quasar-app-extension-animate";
import { defineComponent } from "vue";

export default defineComponent({
  name: "AboutPage",
  setup() {
    useAnimate();

    return { whenPastEnd, animateIn };
  },
});
```

## Uninstall

Remove the AE from your Quasar project:

```bash
quasar ext remove @dreamonkey/animate
```

Remove the SCSS variables file import from `src/css/quasar.variables.scss`.

Remove all `AnimateMixin` and `useAnimate` references.

## How to use it

Add `data-animate` attribute on every element to which you want to attach an appear animation.
The mixin/composable will set the opacity of all marked elements to zero during the component mount phase, making them invisible until they are triggered.

```html
<img data-animate class="my-dog" src="img/doggo.jpg" />
```

Use the `v-intersection` directive and combine the functions provided by this AE to express the animation you want to obtain.
As example, here's how you can animate an image with the following properties:

- activate the animation when it fully came into view (`whenPastEnd`)
- apply a decelerating easing, typical of entering animations (`animateIn`)
- use the `fadeInDown` class to define the animation you want to apply
- make the animation last 800ms

```html
<img
  v-intersection.once="
    whenPastEnd(animateIn('fadeInDown', { duration: '800ms' }))
  "
  data-animate
  class="my-dog"
  src="img/doggo.jpg"
/>
```

## Concatenated animations

You can manage multiple parallel, staggered or concatenated animations adding a bit of scripting.
In this example a vertical separator is animated to grow in height while a title is animated in too, **then** all paragraphs of the content div are animated with a staggered fading in effect.

Our template will be:

```html
<template>
  <div
    v-intersection.once="whenPastPercentage(0.1, animateSection)"
    class="container"
  >
    <span class="separator" />
    <div class="body">
      <h5 data-animate class="title">MY TITLE</h5>
      <div class="content">
        <p data-animate>p1</p>
        <p data-animate>p2</p>
        <p data-animate>p3</p>
        <p data-animate>p4</p>
        <p data-animate>p5</p>
      </div>
    </div>
  </div>
</template>
```

```scss
.separator {
  border-left: solid 4px black;
  // separator animation is based on `scaleY` so we initially set it to 0
  transform: scaleY(0);
  transform-origin: top;
}

.scale-normal {
  transform: scale(1);
  transition-property: transform;
}
```

Define the method which starts the animations on the component

```js
import { animateIn } from "@dreamonkey/quasar-app-extension-animate";

export default {
  // ...
  methods: {
    animateSection(el) {
      const separator = el.querySelector(".separator");
      const title = el.querySelector(".title");
      const elements = el.querySelector(".content").children;
      let i = 0;
      animateIn("fadeInLeft", {
        duration: `${TITLE_AND_SEPARATOR_ANIMATION_DURATION}ms`,
      })(title);
      animateIn("scale-normal", {
        duration: `${TITLE_AND_SEPARATOR_ANIMATION_DURATION}ms`,
      })(separator);
      elements.forEach((element) => {
        animateIn("fadeInLeft", {
          duration: `${PARAGRAPHS_ANIMATION_DURATION}ms`,
          delay: DELAY_BEFORE_START + DELAY_BETWEEN_PARAGRAPHS_ANIMATION * i,
        })(element);
        i++;
      });
    },
  },
};
```

## API

### `animate(animationClass, options)`

Automatically sets a timeout to create a delay if needed and adds the provided class, the [animated](https://quasar.dev/options/animations#Usage) class (needed to execute animations). Based on the options, it will also apply easing and duration classes. In case the element was hidden thanks to `data-animate` attribute, the opacity is reset to its original CSS value before the the animation starts.

Returns an `intersectionHandler` function usable with `whenPastXxx` helpers.

### `animateIn(animationClass, options)`

Same as `animate` but adds a `decelerate` easing by default.

### `animateOut(animationClass, options)`

Same as `animate` but adds an `accelerate` easing by default.

### `whenPast(percentageOrAlias, intersectionHandler)`

`percentageOrAlias` can be both a percentage (0.0 < x < 1.0) or a percentage alias (`start` => 0.0, `quarter` => 0.25, `half` => 0.5, `end` => 1.0).

Returns a function in the format accepted by `v-intersection` Quasar directive, accepting an element reference and returning an intersection observer configuration object.

### `whenPastPercentage(percentage, intersectionHandler)`

Same as `whenPast` but only accepts a numeric percentage.

### `whenPastStart(intersectionHandler)` | `whenPastQuarter(intersectionHandler)` | `whenPastHalf(intersectionHandler)` | `whenPastEnd(intersectionHandler)`

Same as `whenPast` but with pre-applied percentage.

## Common mistakes

### SVG images doesn't works with directives

Currently if you try to use this directive on svg tags you'll get an error like `ReferenceError: _directive_intersection is not defined`.
Here is the [issue link](https://github.com/vuejs/core/issues/5289).

A work around is wrapping the svg into a div and apply this directive on it:

```html
<div
  v-intersection.once="
    whenPastEnd(animateIn('fadeInDown', { duration: '800ms' }))
  "
  data-animate
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    version="1.1"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      d="M2,3H5.5L12,15L18.5,3H22L12,21L2,3M6.5,3H9.5L12,7.58L14.5,3H17.5L12,13.08L6.5,3Z"
    />
  </svg>
</div>
```

Notice that this is the case for svg inlined by third party tools too, eg. [svg-inline-loader](https://github.com/webpack-contrib/svg-inline-loader#svg-inline-loader-for-webpack).

### Animation are triggered based on the percentage of the element which is contained in the screen, **NOT ON THE ELEMENT HEIGHT** :

- On small screens elements might not resize correctly and part of them could overflow. Having a piece of it always out of the screen would prevent the trigger to fire.
- The same concept applies if the element is too big and overflows its container.
- Borders and paddings are part of the element box model and could prevent the trigger to fire.

As example, consider a screen with height 900px containing an element with height of 1000px, both with the same width.
If you want to animate the element with `whenPastEnd(...)` the element will never show up because the trigger condition cannot be met.

In this context, the `End` part represent the moment where the element is fully contained into the view, not the end of the element height.

## Donate

If you appreciate the work that went into this App Extension, please consider [donating](https://github.com/sponsors/dreamonkey).
