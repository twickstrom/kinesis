# Kinesis

[![NPM Version](https://img.shields.io/npm/v/%40timwickstrom%2Fkinesis?style=flat-square&color=black)](https://www.npmjs.com/package/@timwickstrom/kinesis)
[![JSR](https://jsr.io/badges/@timwickstrom/kinesis?style=flat-square)](https://jsr.io/@timwickstrom/kinesis)
[![CI](https://img.shields.io/github/actions/workflow/status/twickstrom/kinesis/ci.yml?branch=main&style=flat-square&label=CI&color=black)](https://github.com/twickstrom/kinesis/actions/workflows/ci.yml)
[![License](https://img.shields.io/npm/l/%40timwickstrom%2Fkinesis?style=flat-square&color=black)](./LICENSE)

**Motion tokens designed around how things feel.**

---

**Stop guessing how math feels.**

Great interfaces feel intentional — not because their animations are fast, but because they respond the way physical things do.

Kinesis is a definitive reference for modern UI animation—transforming abstract cubic beziers and CSS `linear()` physics into a functional design strategy. From standard Tailwind CSS transitions to spatial depth, haptic micro-interactions, and fluid scrollytelling, every easing token is documented with its exact behavioral intent and prescriptive use case.

115 tokens covering haptics, springs, physics, depth, cinematics, scroll dynamics, and retro/novelty aesthetics. Inspired by Apple's fluid motion, Material 3's expressiveness, and modern haptic design principles.

**Framework-agnostic. Tailwind v4-native. Designed around behavior, not bezier math.**

---

## Install

```sh
# npm
npm install @timwickstrom/kinesis

# pnpm
pnpm add @timwickstrom/kinesis

# yarn
yarn add @timwickstrom/kinesis

# bun
bun add @timwickstrom/kinesis
```

## Usage

### Tailwind v4

```css
@import "tailwindcss";
@import "@timwickstrom/kinesis/tailwind";
```

Utility classes wire up automatically:

```html
<div class="transition ease-spring-gentle duration-500">...</div>
<div class="animate-easing-haptic-confirm">...</div>
```

### Recommended Pairing: tailwind-animations

Kinesis handles the **easing**, but you still need the **keyframes**. Kinesis works wonderfully out-of-the-box with the [tailwind-animations](https://www.npmjs.com/package/tailwind-animations) package.

```css
@import "tailwindcss";
@import "@timwickstrom/kinesis/tailwind";
@import "tailwind-animations";
```

Combine them in your markup for incredibly expressive motion:

```html
<!-- Fades in, moving up slightly, with a satisfying bouncy spring -->
<div class="animate-fade-in-up ease-spring-bouncy animate-duration-[500ms]">
  ...
</div>
```

### Native CSS / Vanilla Web

```css
@import "@timwickstrom/kinesis";

.button {
  transition: all 300ms;
}

.button:active {
  transition-timing-function: var(--ease-haptic-click);
}
```

```javascript
// You can also use the CSS variables directly in JS via the Web Animations API
element.animate(
  [{ transform: "translateY(0)" }, { transform: "translateY(-20px)" }],
  {
    duration: 500,
    easing: "var(--ease-spring-gentle)",
  }
);
```

### React & Next.js (Framer Motion)

Works seamlessly with `framer-motion` (or the newer `motion/react`):

```tsx
import { easings } from "@timwickstrom/kinesis/js";
import { motion } from "framer-motion"; // or "motion/react"

export function Component() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: easings.springBouncy,
      }}
    >
      Hello World
    </motion.div>
  );
}
```

### Vue

```vue
<script setup>
import { easings } from "@timwickstrom/kinesis/js";
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300"
    :style="{ transitionTimingFunction: easings.entrance }"
  >
    <div v-if="show">...</div>
  </Transition>
</template>
```

### Svelte

```svelte
<script>
  import { easings } from "@timwickstrom/kinesis/js";
  import { fly } from "svelte/transition";

  // Note: Svelte transitions expect a JS easing function, but
  // you can apply the raw strings to inline styles or CSS variables
  let isHovered = false;
</script>

<button
  style:transition-timing-function={easings.hover}
  style:transition-duration="150ms"
  style:transform={isHovered ? 'scale(1.05)' : 'scale(1)'}
  on:mouseenter={() => isHovered = true}
  on:mouseleave={() => isHovered = false}
>
  Hover me
</button>
```

---

## Exports

| Path                             | Format      | Use Case                               |
| -------------------------------- | ----------- | -------------------------------------- |
| `@timwickstrom/kinesis`          | CSS         | Raw CSS custom properties (`:root {}`) |
| `@timwickstrom/kinesis/tailwind` | CSS         | Tailwind v4 (`@theme {}` + `@utility`) |
| `@timwickstrom/kinesis/js`       | ESM + Types | JavaScript object with full JSDoc      |
| `@timwickstrom/kinesis/src`      | CSS         | Unprocessed source                     |

---

## Token Reference

Each token ships with:

- `@behavior` — what it feels like in motion
- `@use` — exact UI scenarios it's designed for
- `@timing` — recommended duration ranges
- `@type` — `cubic-bezier`, `linear`, or `steps`

| Category                | Tokens                                                                                                                                                                                                |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Semantic Intent         | `ease-entrance` `ease-exit` `ease-emphasis`                                                                                                                                                           |
| UI Components           | `ease-ui-drawer` `ease-ui-modal` `ease-ui-toast` `ease-ui-sheet` `ease-ui-popover` `ease-ui-overlay`                                                                                                  |
| Foundational Curves     | `ease-sine-*` `ease-quad-*` `ease-cubic-*` `ease-quart-*` `ease-quint-*` `ease-expo-*` `ease-circ-*` `ease-back-*`                                                                                    |
| Physics & Elastics      | `ease-elastic-*` `ease-bounce-*` `ease-spring-*` `ease-rubber-band` `ease-pendulum`                                                                                                                   |
| Haptic & Tactile        | `ease-haptic-click` `ease-haptic-snap` `ease-haptic-confirm` `ease-haptic-reject` `ease-haptic-error` `ease-haptic-anticipation` `ease-haptic-slingshot` `ease-haptic-long-press` `ease-haptic-swipe` |
| Design Systems          | `ease-apple-fluid` `ease-m3-emphasized` `ease-fluent-expressive` `ease-vercel-spark` `ease-stripe-gloss`                                                                                              |
| Organic & Ambient       | `ease-breath` `ease-pulse` `ease-flutter` `ease-wave` `ease-tide` `ease-shimmer` `ease-viscous` `ease-surface-tension`                                                                                |
| Cinematic & Editorial   | `ease-sigmoid` `ease-soft-land` `ease-time-jump` `ease-slow-burn` `ease-dramatic-reveal` `ease-jitter` `ease-glitch` `ease-depth`                                                                     |
| Mechanical & Industrial | `ease-hydraulic` `ease-piston` `ease-ratchet` `ease-gear-lock` `ease-impact` `ease-whiplash` `ease-magnetic-snap`                                                                                     |
| Spatial / Z-Axis        | `ease-z-pull` `ease-z-push` `ease-z-float` `ease-z-sink` `ease-parallax`                                                                                                                              |
| Scroll-Driven           | `ease-scrub-smooth` `ease-scrub-sticky` `ease-scroll-snap`                                                                                                                                            |
| Retro & Discrete        | `ease-steps-*` `ease-mario-jump` `ease-pac-man` `ease-sonic-dash` `ease-pinball` `ease-moonwalk` `ease-vhs` `ease-dialup` `ease-leeroy` `ease-rickroll` `ease-harlem-shake` `ease-turn-down`          |

> Full interactive documentation: [timwickstrom.com/projects/kinesis](https://timwickstrom.com/projects/kinesis)

---

## License

MIT © [Tim Wickstrom](https://timwickstrom.com)

Attribution is required when redistributing or integrating Kinesis as part of a commercial product or service. See [LICENSE](./LICENSE) for full terms.
