# Quasar Animation Extension

This app extension was created to simplify the use of animations activated when elements show up on the screen.
Is based on the [Intersection Directive](https://quasar.dev/vue-components/intersection#Introduction) wich detect when the user scrolls and the DOM element (or component) that it is applied to comes into or out of the viewport also computing the percentage.

You can so trigger animations once an element just comes on the screen or trigger it after a determined percentage is passed.

It also give you more access to set easing and duration on the same line.

# Install

To install this App Extension you just need to launch on the quasar project terminal:

```bash
quasar ext add extend-animation
```

# Uninstall

```bash
quasar ext remove extend-animation
```

# How It Works

First of all you need to deep import the scss file inside your 'quasar.variables.scss' file by adding:

```js
@import '@dreamonkey/quasar-app-extension-extend-animation/src/animations.scss';
```

Then specify that you are using that mixin on every file you want to use it:

```js
import AnimateMixin from '@dreamonkey/quasar-app-extension-extend-animation/src/animate';
...
mixins: [AnimateMixin]
```

Next you should add the 'data-animate' data attribute on every element that you want to animate:

```js
<img
  data-animate //  <----- like so
  svg-inline
  class="my-class"
  alt="alternative text"
  src="my/path"
/>
```

This will ensure that every element will have a zero opaccity making them invisible when non animated yet.
(Not requiredd but reccomended to prevent ugly animations)

Next you can start to animate your element by setting the v-intersection directive. An example could be animate the previous image when is all visible on the screen giving the fadeInDown effect with an easing-in and a duration of 800ms:

```js
<img
    v-intersection.once="
        whenPastEnd(animateIn('fadeInDown', { duration: '800ms' }))
    "
    data-animate
    svg-inline
    class="my-class"
    alt="alternative text"
    src="my/path"
/>
```

You can also trigger a series of animations al concatenated.
In the next example we animate a vertical lateral line to grow in height and contemporary a title. Next we animate all the paragraphs fading in from left.

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

The separator animation is based on scaleY so is settet on 0 by default.
Also the overflow of the container must be hidden to prevent the paragraphs to be seen from the outside.
We also setted the z-index of our vertical line to be 1 and prevent the paragraphs to be animated over.

```scss
.container {
  display: flex;
  margin: $container-margin;
  overflow: hidden;
}

.separator {
  border-left: solid 4px $accent-light;
  transform: scaleY(0);
  transform-origin: top;
  width: 0;
  z-index: 1;
}

.scale-normal.scale-normal {
  transform: scale(1);
  transition-property: transform;
}
```

The magic part to start the animation is a simple js method that will trigger all the animations:

```js
methods: {
    animateSection(el) {
      const separator = el.querySelector('.separator');
      const title = el.querySelector('.title');
      const elements = el.querySelector('.content').children;
      let i = 0;

      this.animateIn('fadeInLeft', {
        duration: `${INITIAL_ANIMATION_DURATION}ms`,
      })(title);
      this.animateIn('scale-normal', {
        duration: `${INITIAL_ANIMATION_DURATION}ms`,
      })(separator);

      elements.forEach(element => {
        this.animateIn('fadeInLeft', {
          duration: `${ELEMENTS_ANIMATION_DURATION}ms`,
          delay: DELAY_BEFORE_START + DELAY_BETWEEN_ELEMENTS_ANIMATION * i,
        })(element);
        i++;
      });
    },
  },
```

# API

- `animate`

  Takes 2 parameters: the animation class and an option object.

  It set a timeout to create a delay if needed and adds the passed class, the 'animated' class needed to execute animations, and based on the options, an easing and a duration class. It also set the opacity to "" so the element become visible again once the animation starts.

- `animateIn`

  Takes the same 2 parameter as animate and the only difference is that adds a decelerate easing by default.

- `animateOut`

  It differ from animateIn just by adding an accelerate easing instead.

- `whenPastPercentage`

  Takes a percentage value and an handler.
  It returns an intersection observer composed by a callback handler and a cfg file and takes the intersectionObserverEntry used to find the element we want to apply the animation.

- `whenPastEnd`,`whenPastHalf`,`whenPastQuarter`,`whenPastStart`,`whenPast`

  ust make a more intuitive mechanism.

- `whenPast`

  Simlarly this method takes an handler and the peculiarity is that you can also pass a number or a string as a percentage.
  (The string must be one from the ones contained in the 'percentageKeywordMap'.)

# Other Info

Inside the scss file we also have some usefull set of standard variables like the most used durations for the animations and an accelerate, decelerate and standaard easing.

# Be carefull

This AE as already anticipated trigger the animations based on the pergentage of an element in the viewport so be carefull when:

- On small screens
  It might broke because elements wont resize correctly and part of them will always overflow breaking the mechanism.
- On big elements
  For the same concept if the element is to big and suppose that you want to trigger the animation `whenPastHalf` but it can't be contained in the viewport the animation could never be triggered.
  (As the `whenPastHalf` refer to half of the percentage and NOT half of the height of the element)
- Margins/borders/and paddings
  Because they also are a part of the element and they influence the percentage.

# Donate

If you appreciate the work that went into this App Extension, please consider [donating to Quasar](https://donate.quasar.dev).

# extend-animation
