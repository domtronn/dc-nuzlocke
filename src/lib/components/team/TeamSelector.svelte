<script>
  import { createEventDispatcher } from 'svelte'
  import { browser } from '$app/env'
  import { activeGame, getGame, read } from '$lib/store'
  import { sanitise, capitalise } from '$lib/utils/string'

  import { AutoComplete, IconButton } from '$lib/components/core'
  import Bin from 'svelte-icons-pack/bi/BiTrash'

  /** Trainer data */
  const cleartrainer = _ => trainer = null
  const trainers = [
    'brendan', 'calem', 'dawn-pt', 'dawn', 'elio', 'ethan',
    'gloria', 'hilbert', 'hilda', 'leaf', 'lucas-pt', 'lucas', 'lyra',
    'may', 'nate', 'red', 'rosa', 'selene', 'serena', 'victor'
  ]
  const trainerItems = trainers.map(label => ({ label }))

  /** Box data */
  let teamHandlers = []
  const clearteam = i => _ => team[i] = null

  const formatName = pkmn => pkmn.nickname
        ? `${capitalise(pkmn.nickname)} the ${sanitise(capitalise(pkmn.pokemon))}`
        : sanitise(capitalise(pkmn.pokemon))

  const formatItems = data => Object.values(data)
        .filter(i => i.pokemon)
        .map(i => ({ ...i, label: formatName(i) }))

  let teamItems = []
  activeGame.subscribe(gameId => {
    if (browser && !gameId) return
    getGame(gameId).subscribe(read(data => teamItems = formatItems(data)))
  })

  const dispatch = createEventDispatcher()
  const onchange = (value, i) => e => {
    if (e.detail.value && e.detail.value?.id !== _team[i]?.id)
      dispatch('change', { value: i })

    _team[i] = value
  }

  let _team = Array(6).fill(null)

  export let trainer = { label: trainers[0] }
  export let team = Array(6).fill(null)
  export let className = ''
</script>

<div class='grid grid-cols-2 lg:grid-cols-4 gap-2 {className}'>
  <div class=col-span-1 />
  <span>
    <AutoComplete
      rounded
      className=w-full
      placeholder=Trainer
      items={trainerItems}
      bind:selected={trainer}
      item={trainerItems} />

    <IconButton
      rounded
      src={Bin}
      title=Clear
      track=clear-trainer
      on:click={cleartrainer} />
  </span>
  <div class=col-span-1 />

  {#each team as t, i}
    <span class:lg:flex-row-reverse={i % 2 == 0}>
      <AutoComplete
        rounded
        className=w-full
        items={teamItems}
        placeholder='Team member {i + 1}'
        bind:selected={team[i]}
        on:change={onchange(team[i], i)} />

      <IconButton
        rounded
        src={Bin}
        title=Clear
        track=clear-team
        on:click={clearteam(i)} />
    </span>
  {/each}

</div>

<style>
  span {
    @apply inline-flex gap-x-1 col-span-2
  }
</style>
