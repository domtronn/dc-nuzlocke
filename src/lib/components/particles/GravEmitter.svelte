<script>
  export let x, x0, y, y0, t
  export let duration = 100, g = 980, debug = false, side = 'left'

  import Particle from './GravParticle.svelte'

  console.log('grav', x, x0, y, y0)

  const sq = x => x * x
  const coords = (amt, t, v, g, theta, x0) => Array(amt + 1).fill().map((_, i) => {
    const ti = (t * i) / amt
    return [
      (v * ti * Math.cos(theta)) + x0,
      (v * ti * Math.sin(theta)) - (g * Math.pow(ti, 2) / 2)
    ]
  })

  const tn = t / 1000

  const ux = x / tn                      // initial x velocity
  const uy = (y + (g * sq(tn) / 2)) / tn // Initial y velocity

  const u = Math.sqrt(sq(ux) + sq(uy)) // Initial velocity magnitude
  const theta = Math.atan(uy / ux)     // Initial launch angle

  const c = coords(20, tn, u, g, theta, x0)

  let show = true, showtimeout
</script>

<div class='start-point' style='top: {y0}px; {side}: {x0}px;'>
  <Particle
    {g}
    {side}
    theta={-theta}
    scale={1.6}
    v={u}
  >
    <slot />
  </Particle>
</div>

{#if debug}
  {#each c as [x, y], i}
    <div class='coord-{i}' style='top: {y0 - y}px; {side}: {x}px;' />
  {/each}
{/if}

<style>
  div {
    @apply absolute;
  }
</style>
