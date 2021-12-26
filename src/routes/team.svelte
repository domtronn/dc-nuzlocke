<script>
  import { draggable } from 'svelte-drag'
  import { getContext } from 'svelte'

  import { Button } from '$lib/components/core'
  import ParticleEmitter from '$lib/components/core/ParticleEmitter.svelte'
  import TeamSelector from '$lib/components/team/TeamSelector.svelte'
  import { Particle } from '$lib/components/particles'

  let heightToggle = true

  let trainer, flipped
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

  const clear = () => {
    team.forEach((t, i) => { if (t) teamHandlers[i].hide() })
    team = Array(6).fill(null)
  }

  const handlechange = e => teamHandlers[e.detail.value].create()
  const handledrag = _ => document.documentElement.classList.add('dragging')
  const handledragend = _ => document.documentElement.classList.remove('dragging')

</script>

<main>

  <div id=controls class='flex flex-1 flex-col relative'>

    <div class=imagery>
      {#each team as t, cid}
        <ParticleEmitter
          {cid}
          bind:this={teamHandlers[cid]}
          >
          {#if team[cid]}
            {#await getPkmn(team[cid].pokemon) then P}
              <div style='transform: scaleY({heightToggle ? Math.cbrt(P.heightm) : 1}) scaleX({(heightToggle ? Math.cbrt(P.heightm) : 1) * (team[cid].flipped ? -1 : 1)})' >
                <img
                  class='bob bob--{cid}'
                  src=https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{P.imgId}.png />
              </div>
            {/await}
          {/if}
        </ParticleEmitter>
      {/each}

      {#if trainer}
        <div class=trainer
             class:flipped={flipped}
             use:draggable
             on:svelte-drag={handledrag}
             on:svelte-drag:end={handledragend}
             >
          <img
            src=/leaders/{trainer.toLowerCase()}.png
            alt={trainer}
            class='absolute left-1/2 -translate-x-1/2'
            width=120
            height=120
            />
        </div>
      {/if}
    </div>

    <div
      style='z-index:99999999'
      class='controls border-t fixed bottom-0 border-gray-700 left-0 right-0 pb-32 px-4 pt-2 lg:pt-6'>
      <div class='max-w-4xl mx-auto'>
      <TeamSelector
        className='mx-auto lg:w-2/3'
        bind:trainer={trainer}
        bind:flipped={flipped}
        bind:team={team}
        on:change={handlechange}
        />

      <div class='w-full mt-4 text-center'>
        <Button size=xs rounded on:click={clear}>Clear</Button>
        <Button size=xs rounded on:click={hide}>Call back</Button>
        <Button size=xs rounded on:click={create}>Send out</Button>
      </div>
    </div>
    </div>

  </div>
</main>

<style>

  img { margin: -8px; cursor: move; }
  img { image-rendering: pixelated; }
  img.bob { animation: bob 6s ease infinite; }

  .trainer img {
    @apply absolute top-40;
    transform: var(--tw-transform) scale(0.8);
  }
  .trainer.flipped img { transform: var(--tw-transform) scaleX(-0.8) scaleY(0.8); }

  @media (min-width:theme('screens.sm')) {
    .trainer img {
      @apply absolute top-40;
      transform: var(--tw-transform) scale(1.6);
    }
    .trainer.flipped img { transform: var(--tw-transform) scaleX(-1.6) scaleY(1.6); }
  }

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
