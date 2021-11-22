<script>
  import { draggable } from 'svelte-drag'
  import { getContext } from 'svelte'
  import { browser} from '$app/env'
  import { fade } from 'svelte/transition'

  import { AutoComplete, IconButton, PIcon, Picture } from '$lib/components/core'
  import ParticleEmitter from '$lib/components/core/ParticleEmitter.svelte'

  const trainers = [
    'blue', 'brendan', 'calem', 'dawn-pt', 'dawn', 'elio', 'ethan',
    'gloria', 'hilbert', 'hilda', 'leaf', 'lucas-pt', 'lucas', 'lyra',
    'may', 'nate', 'red', 'rosa', 'selene', 'serena', 'victor'
  ]
  let trainer = { label: trainers[0] }

  import Bin from 'svelte-icons-pack/bi/BiTrash'

  import { Particle } from '$lib/components/particles'
  import { activeGame, getGame, read } from '$lib/store'
  let team = Array(6).fill(null)
  let teamHandlers = []

  const { getPkmn } = getContext('game')

  let box = {}
  activeGame.subscribe(gameId => {
    if (browser && !gameId) return
    getGame(gameId).subscribe(read(data => box = data))
  })

  // TODO: Name tags toggle
  // TODO: Toggle animation
  // TODO: Export as PNG
  // TODO: Trainer sprites
  // TODO: Wire into store

  $: items = Object
  .values(box)
  .filter(i => i.pokemon)
  .filter(i => !team.map(i => i?.id).includes(i?.id))
  .map(i => ({
    ...i,
    label: i.nickname
      ? `${i.nickname} the ${i.pokemon}`
      : i.pokemon
  }))

  const create = () => {
    team.forEach((t, i) => {
      if (t) teamHandlers[i].create()
    })
  }

</script>


<main class=p-container>
  <div class='flex flex-1 flex-col justify-between relative'>
    <button on:click={create}>
      send out team
    </button>

    {#if trainer}
      <div class=trainer
           use:draggable
           on:svelte-drag={_ => document.documentElement.classList.add('dragging')}
           on:svelte-drag:end={_ => document.documentElement.classList.remove('dragging')}
      >
        <img
          src=/leaders/{trainer.label}.png
          alt={trainer.label}
          class='absolute left-1/2 -translate-x-1/2'
          width=80
          height=80
          />
      </div>
    {/if}

    {#each team as t, cid}
      <ParticleEmitter
        {cid}
        bind:this={teamHandlers[cid]}
        >
        {#if team[cid]}
          {#await getPkmn(team[cid].pokemon) then P}
            <div>
              <img
                class='bob bob--{cid}'
                src=https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{P.imgId}.png
                />
            </div>
          {/await}
        {/if}
      </ParticleEmitter>
    {/each}

<div class='w-2/3 mx-auto grid grid-cols-4 grid-rows-3 gap-2'>
  <span class=col-span-1/>
  <span class='inline-flex gap-x-1 col-span-2'>
    <AutoComplete
      rounded
      bind:selected={trainer}
      items={trainers.map(i => ({ label: i }))}
      className=w-full
      placeholder=Trainer
    />
      <IconButton
        rounded
        src={Bin}
        title=Clear
        track=clear
        on:click={_ => trainer = null}
      />
      </span>
    <span class=col-span-1/>
  {#each team as t, i}
    <span class:flex-row-reverse={i%2===0} class='inline-flex gap-x-1 col-span-2'>
    <AutoComplete
      rounded
      {items}
      on:change={e => {
      if (team[i]?.id === e.detail.value.id) return
      team[i] = e.detail.value
      teamHandlers[i].create()
      }}
      className='w-full'
      placeholder='Team member {i + 1}'
      />
      <IconButton
        rounded
        src={Bin}
        title=Clear
        track=clear
        on:click={_ => team[i] = null}
      />
      </span>
    {/each}
  </div>
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
