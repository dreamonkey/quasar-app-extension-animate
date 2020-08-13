# Quasar animation system extension

This app extension simplifies the use of animations activated when elements show up on the screen.
It's meant to work with [Intersection Directive](https://quasar.dev/vue-components/intersection#Introduction).

All elements marked by a `[data-animate]` attribute will be hidden upon component mount and shown, with the animation you provide, once they come into view for a percentage you decide. You can also manage the animation delay, duration and easing via CSS classes or SCSS variables and functions.

## Install

Add the App Extension into your Quasar project

```bash
quasar ext add @dreamonkey/animate
```

Import the SCSS variables file at the end of your `src/css/quasar.variables.scss`

```scss
@import "@dreamonkey/quasar-app-extension-animate/src/animations.scss";
```

If using Options or Class API, register the mixin on all components using this AE features

```ts
import { AnimateMixin } from "@dreamonkey/quasar-app-extension-animate";

export default {
  // ...
  mixins: [AnimateMixin],
};
```

If using Composition API, call the composable on all components using this AE features and provide it a ref to the component template root

```ts
import { useAnimate } from "@dreamonkey/quasar-app-extension-animate";
import { defineComponent, ref, Ref } from "@vue/composition-api";

export default defineComponent({
  // ...
  setup() {
    const hostRef = ref() as Ref<HTMLElement>;

    return { hostRef, ...useAnimate(hostRef) };
  },
});
```

## Uninstall

Remove the App Entension from your Quasar project

```bash
quasar ext remove @dreamonkey/animate
```

Remove the SCSS variables file import from the end of your `src/css/quasar.variables.scss`

Remove all `AnimateMixin` and `useAnimate` references

## How It Works

Add `data-animate` attribute on every element you want to animate

```html
<img data-animate class="my-dog" src="img/doggo.jpg" />
```

The mixin/composable will set the opacity of all marked elements to zero during the component mount phase, making them invisible when not yet animated.

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

You can manage multiple parallel, staggered or concatenated animations adding a bit of scripting.
In this example a vertical separator is animated to grow in height while a title is animated in too, then all paragraphs of the content div are animated with a staggered fading in effect.

Our template will be:

```html
<div
  v-intersection.once="whenPastPercentage(0.1, animateSection)"
  class="container"
>
  <span class="separator" />
  <div class="body">
    <h5 data-animate class="title">
      MY TITLE
    </h5>
    <div class="content">
      <p data-animate>p1</p>
      <p data-animate>p2</p>
      <p data-animate>p3</p>
      <p data-animate>p4</p>
      <p data-animate>p5</p>
    </div>
  </div>
</div>
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
export default {
  // ...
  methods: {
    animateSection(el) {
      const separator = el.querySelector(".separator");
      const title = el.querySelector(".title");
      const elements = el.querySelector(".content").children;
      let i = 0;
      this.animateIn("fadeInLeft", {
        duration: `${INITIAL_ANIMATION_DURATION}ms`,
      })(title);
      this.animateIn("scale-normal", {
        duration: `${INITIAL_ANIMATION_DURATION}ms`,
      })(separator);
      elements.forEach((element) => {
        this.animateIn("fadeInLeft", {
          duration: `${ELEMENTS_ANIMATION_DURATION}ms`,
          delay: DELAY_BEFORE_START + DELAY_BETWEEN_ELEMENTS_ANIMATION * i,
        })(element);
        i++;
      });
    },
  },
};
```

## API

### `animate(animationClass, options)`

Sets a timeout to create a delay if needed and adds the provided class, the 'animated' class needed to execute animations, and based on the options, an easing and a duration class. It also set the opacity to "" so the element become visible again once the animation starts.

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

## Other Info

The SCSS file contains many variables and functions you can use to make your style definitions more readable and coherent, eg. most used durations, commonly used easing functions, etc.

## Be careful

This AE has already anticipated trigger the animations based on the percentage of an element in the viewport so be careful when:

- On small screens
  It might broke because elements wont resize correctly and part of them will always overflow breaking the mechanism.
- On big elements
  For the same concept if the element is to big and suppose that you want to trigger the animation `whenPastHalf` but it can't be contained in the viewport the animation could never be triggered.
  (As the `whenPastHalf` refer to half of the percentage and NOT half of the height of the element)
- Margins/borders/and paddings
  Because they also are a part of the element and they influence the percentage.

## Donate

If you appreciate the work that went into this App Extension, please consider [donating to Quasar](https://donate.quasar.dev).
