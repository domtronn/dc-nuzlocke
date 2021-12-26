<script>
  export let cid = 0, scale = 4

  import { onMount } from 'svelte'
  import { draggable } from 'svelte-drag'
  import { fade } from 'svelte/transition'
  import { sineInOut, elasticOut, sineOut } from 'svelte/easing'
  import Particle from '$lib/components/particles/GravEmitter.svelte'
  import { PIcon } from '$lib/components/core'

  const calc = (i) => [
    window.innerWidth / 2
      * (i % 2
         ? 1 + (Math.ceil((i + 1) / 2) / 6)
         : 1 - (Math.ceil((i + 1) / 2) / 6)),
    window.innerHeight / 4
      * (1 + (Math.ceil((i + 1) / 2) / 5))
  ]

  let x, y, y0, x0 = 0, tx, ty
  onMount(() => {
    ;[x, y] = [tx, ty] = calc(cid)
    y0 = window.innerHeight / 2
  })

  let created = false, show = true, createdtimeout
  export const create = _ => {
    ;[x, y] = [tx, ty]
    show = true
    created = true
    clearTimeout(createdtimeout)
    createdtimeout = setTimeout(_ => created = false, 1100)
  }

  export const hide = _ => show = false

  const handledrag = _ => document.documentElement.classList.add('dragging')
  const handledragend = e => {
    ;[tx, ty] = [x + e.detail.offsetX, y + e.detail.offsetY]
    document.documentElement.classList.remove('dragging')
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

{#if created}
  <Particle
    {scale}
    duration={300}
    side={cid % 2 ? 'right' : 'left'}
    x={cid % 2 ? window.innerWidth - tx + x0 : tx - x0}
    y={y0 - ty}
    x0={x0}
    y0={y0}
    t=1250
  >
    <span
      in:scaleanim={{ duration: 300 }}
      out:scalebright={{ duration: 100, opacity: true }}
    >
      <PIcon type=item name=poke-ball />
    </span>
  </Particle>
{:else if !created && show && $$slots.default}
  <div
    use:draggable
    on:svelte-drag={handledrag}
    on:svelte-drag:end={handledragend}
    class='absolute cursor-move hover:drop-shadow-h-black hover:dark:drop-shadow-h-white z-30'
    style='top: {y}px; left: {x}px; --scale: {scale}; --n-scale: {-scale};'
  >
    <span
      class='fixed transform {cid % 2 ? '-mr-10' : '-ml-10'} z-30 container--{cid % 2 ? 'right' : 'left'} w-12'
      in:scalebright={{ duration: 800, mod: cid % 2 ? scale : -scale, ease: elasticOut }}
      out:scalebright={{ duration: 200, mod: cid % 2 ? scale : -scale }}
    >
      <slot />
    </span>
  </div>
{/if}

<style>
  span.container--left { transform: scale(var(--n-scale), var(--scale)) !important; }
  span.container--right { transform: scale(var(--scale), var(--scale)) !important; }
</style>
