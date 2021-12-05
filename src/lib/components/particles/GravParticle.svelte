<script>
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'

  import Noise from 'simplex-noise'
  const simplex = new Noise()

  export let theta, v, g = 3, scale = 1, className = '', side = 'left'

  const random = (Math.random() * 600) + 200
  let x = 0, y = 0, tiltTheta = 0
  let t = 0

  onMount(() => {
    let frame, start
    function loop (ts) {
      if (start === undefined) start = ts
      t = (ts - start) / 1000

      frame = requestAnimationFrame(loop)

      const tiltOffset = simplex.noise2D(x / random, y / random) * (Math.PI / 16)
      tiltTheta = tiltTheta + tiltOffset

      x = (Math.cos(theta) * v * t)
      y = (Math.sin(theta) * v * t) + (g * t * t / 2)
    }

    loop()
    return () => cancelAnimationFrame(frame)
  })
</script>

{#if side === 'left'}
  <span
    out:fade={{ duration: 100 }}
    class='absolute flex items-center justify-center origin-center {className}'
    style='left: {x}px; top: {y}px; transform: rotate({tiltTheta}rad) scale({scale});'
  >
    <slot />
  </span>
{:else}
  <span
    out:fade={{ duration: 100 }}
    class='absolute flex items-center justify-center origin-center {className}'
    style='right: {x}px; top: {y}px; transform: rotate({tiltTheta}rad) scale({scale});'
  >
    <slot />
  </span>
{/if}
