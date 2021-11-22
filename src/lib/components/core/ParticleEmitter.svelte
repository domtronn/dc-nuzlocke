<script>
  export let cid = 0

  import { draggable } from 'svelte-drag'
  import { fade } from 'svelte/transition'
  import { sineInOut, elasticOut, sineOut } from 'svelte/easing'
  import { Particle } from '$lib/components/particles'
  import { PIcon } from '$lib/components/core'

  const decay = 0.974
  const scale = 1.5 + Math.random()
  const lTheta = (3 * (Math.PI / 2)) + 0.5
  const rTheta = (3 * (Math.PI / 2)) - 0.5

  const config = [
    { theta: lTheta, g: 7.2, v: 18, abs: 'z-index: 30;left: 18rem; bottom: -3rem' },
    { theta: rTheta, g: 7.2, v: 18, abs: 'z-index: 30;right: 17rem; bottom: -2.2rem' },
    { theta: lTheta, g: 9.2, v: 24, abs: 'z-index: 20;left: 24rem; bottom: -2.5rem;' },
    { theta: rTheta, g: 9.2, v: 24, abs: 'z-index: 20;right: 24rem; bottom: -2.4rem;' },
    { theta: lTheta, g: 11.6, v: 30, abs: 'z-index: 10;left: 30rem; bottom: -1.2rem;' },
    { theta: rTheta, g: 11.6, v: 31, abs: 'z-index: 10;right: 30rem; bottom: -1rem;' },
  ]

  $: c = config[cid]

  let created = false
  export const create = _ => {
    created = true
    setTimeout(_ => created = false, 1100 + Math.random() * 300)
  }

  const scaleanim = (node, { duration, mod = 1 }) => ({
    duration,
    css: t => {
      const easing = sineInOut(t)
      return `transform: scale(${easing * mod});`
    }
  })

  const scalebright = (node, { duration, mod = 1, ease = sineInOut, opacity = false }) => {
    return {
      duration,
      css: t => {
        const easing = ease(t)
        const ease2 = sineOut(t)
        return `
          transform: scale(${easing * mod}, ${easing * Math.abs(mod)});
          filter: brightness(${((1 - ease2) * 16) + 1});
          opacity: ${opacity ? easing : 1};`
      }
    }
  }

</script>

<span
  class='absolute top-1/2'
  class:left-0={cid % 2 == 0}
  class:right-0={cid % 2 == 1}
>
  {#if created}
    <Particle {scale} {decay} theta={c.theta} g={c.g} v={c.v}>
      <span
        in:scaleanim={{ duration: 300 }}
        out:scalebright={{ duration: 300, opacity: true }}
      >
        <PIcon type=item name=poke-ball />
      </span>
    </Particle>
  {:else if !created && $$slots.default}
    <div
      use:draggable
      on:svelte-drag={_ => document.documentElement.classList.add('dragging')}
      on:svelte-drag:end={_ => document.documentElement.classList.remove('dragging')}
      class='cursor-move hover:drop-shadow-h-black hover:dark:drop-shadow-h-white'
    >
      <span
        style={c.abs}
        class='absolute transform container--{cid % 2 ? 'right' : 'left'} w-12'
        in:scalebright={{ duration: 800, mod: cid % 2 ? 4 : -4, ease: elasticOut }}
        out:scalebright={{ duration: 200, mod: cid % 2 ? 4 : -4 }}
        >
        <slot />
      </span>
    </div>
  {/if}
</span>


<style>
  span.container--left { transform: scale(-4, 4) !important; }
  span.container--right { transform: scale(4, 4) !important; }
</style>
