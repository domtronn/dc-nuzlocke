<script>
  import { draggable } from 'svelte-drag'
  import { getContext } from 'svelte'

  import ParticleEmitter from '$lib/components/core/ParticleEmitter.svelte'
  import TeamSelector from '$lib/components/team/TeamSelector.svelte'
  import { Particle } from '$lib/components/particles'

  let heightToggle = true

  let trainer
  let teamHandlers = []
  let team = Array(6).fill(null)

  const { getPkmn } = getContext('game')

  // TODO: Name tags toggle
  // TODO: Toggle animation
  // TODO: Export as PNG
  // DONE: Trainer sprites
  // TODO: Wire into store

  const create = () =>
        team.forEach((t, i) => { if (t) teamHandlers[i].create() })

  const hide = () =>
        team.forEach((t, i) => { if (t) teamHandlers[i].hide() })

  const handlechange = e => teamHandlers[e.detail.value].create()
  const handledrag = _ => document.documentElement.classList.add('dragging')
  const handledragend = _ => document.documentElement.classList.remove('dragging')

</script>

<main class=p-container>
  {#each team as t, cid}
    <ParticleEmitter
      {cid}
      bind:this={teamHandlers[cid]}
      >
      {#if team[cid]}
        {#await getPkmn(team[cid].pokemon) then P}
          <div style='transform: scale({heightToggle ? Math.cbrt(P.heightm) : 1})' >
            <img
              class='bob bob--{cid}'
              src=https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{P.imgId}.png />
          </div>
        {/await}
      {/if}
    </ParticleEmitter>
  {/each}

  <div id=controls class='flex flex-1 flex-col justify-between relative'>
    <div class='inline-flex'>
    <button class='bg-red-500' on:click={create}>
      send out team
    </button>
    <button class='bg-red-500' on:click={hide}>
      hide team
    </button>

    </div>

    {#if trainer}
      <div class=trainer
           use:draggable
           on:svelte-drag={handledrag}
           on:svelte-drag:end={handledragend}
      >
        <img
          src=/leaders/{trainer.label}.png
          alt={trainer.label}
          class='absolute left-1/2 -translate-x-1/2'
          width=120
          height=120
          />
      </div>
    {/if}

  <TeamSelector
    className='mx-auto lg:w-2/3'
    bind:trainer={trainer}
    bind:team={team}
    on:change={handlechange}
  />

  </div>
</main>

<style>

  img { margin: -8px; cursor: move; }
  img { image-rendering: pixelated; }
  img.bob { animation: bob 6s ease infinite; }

  .trainer img { transform: var(--tw-transform) scale(2); }
  .trainer { z-index: 100; position: relative; }

  img.bob--1 { animation-delay: 0.3s; animation-duration: 6s; }
  img.bob--2 { animation-delay: 0.7s; animation-duration: 5s; }
  img.bob--3 { animation-delay: 0.1s; animation-duration: 4.9s; }
  img.bob--4 { animation-delay: 1.1s; animation-duration: 6.2s; }
  img.bob--5 { animation-delay: 0.2s; animation-duration: 5.5s; }

  @keyframes bob {
    0%, 100% {transform: var(--tw-transform) scaleX(1) scaleY(1);}
    25%, 75% { transform: var(--tw-transform) scaleX(1.01) scaleY(0.98); }
    50% { transform: var(--tw-transform) scaleX(0.97) scaleY(1.02); }
  }

  :global(.dragging) img:hover {
    filter: none;
  }

  :global:not(.dragging) img:hover,
  :global(.svelte-draggable-dragging) img
  {
    filter: drop-shadow(1px 1px 0 rgba(0, 0, 0, 1))
            drop-shadow(-1px -1px 0 rgba(0,0,0,1))
            drop-shadow(-1px 1px 0 rgba(0,0,0,1))
            drop-shadow(1px -1px 0 rgba(0,0,0,1));
  }

  :global(.dark) :global:not(.dragging) img:hover {
    filter: drop-shadow(1px 1px 0 rgba(255,255,255,1))
            drop-shadow(-1px -1px 0 rgba(255,255,255,1))
            drop-shadow(-1px 1px 0 rgba(255,255,255,1))
            drop-shadow(1px -1px 0 rgba(255,255,255,1));
  }

  :global(.dark .svelte-draggable-dragging) img
   {
    filter: drop-shadow(1px 1px 0 rgba(255,255,255,1))
            drop-shadow(-1px -1px 0 rgba(255,255,255,1))
            drop-shadow(-1px 1px 0 rgba(255,255,255,1))
            drop-shadow(1px -1px 0 rgba(255,255,255,1)) !important;
   }

  main > div {
    height: calc(100vh - theme('spacing.64'));
  }
</style>
