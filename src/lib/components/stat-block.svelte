<script>
  export let max, atk, def, spd, spa, spe, hp, col = '', nature = [], compare, side = 'right'

  import StatBar from '$lib/components/stat-bar.svelte'
  import NaturesMap from '$lib/data/natures'

  const [pos, neg] = NaturesMap[nature] || []
  const stats = { hp, atk, def, spa, spd, spe }
  const total = Object.values(stats).reduce((acc, it) => acc + it, 0)
</script>

<div style='--t-col: {col}' class='grid grid-cols-11 sm:grid-cols-7 gap-x-2 gap-y-1 items-center'>
  <span class='z-40 absolute top-0 -translate-y-1/2 {side === 'right' ? '-' : ''}translate-x-1/2 {side}-2'>
    <b class='py-1 -ml-2 pl-2 pr-2.5'>{total}</b>
  </span>

  {#each Object.entries(stats) as [s, sval]}
    <StatBar
      className={compare && sval <= compare[s] ? 'grayscale opacity-25' : ''}
      mod={s === pos ? 1.1 : s === neg ? 0.9 : 1} stat={s} val={sval} max={max} />
  {/each}
</div>

<style>
  b {
    z-index: 5;
    position: relative;
  }

  :global(.dark) b::after {
    background-color: theme('colors.gray.900');
  }

  :global(.dark) b::before {
    background-color: theme('colors.gray.900')
  }

  b::after {
    content: '';
    background-color: white;
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    left: 0;
    border-radius: 6px;
    z-index: -5;
    border: 2px solid var(--t-col);
  }

  b::before {
    content: '';
    background-color: white;
    position: absolute;
    top: -1px;
    transform: translateY(calc(100% - 1px));
    left: -2px;
    right: 2px;
    width: calc(100% + 4px);
    height: calc(50% + 2px);
    z-index: -2;
  }

</style>
