<script>
  import { createEventDispatcher } from 'svelte'
  import { browser } from '$app/env'
  import { activeGame, getGame, read } from '$lib/store'
  import { sanitise, capitalise } from '$lib/utils/string'

  import { AutoComplete, IconButton } from '$lib/components/core'
  import Bin from 'svelte-icons-pack/bi/BiTrash'
  import Swap from 'svelte-icons-pack/io/IoSwapHorizontal'

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

  $: teamIds = team.map(i => i?.id)

  const _handle = (i, j) => _ => {
    _team[j] = team[i]
    _team[i] = team[j]
    let _temp = team[j]
    team[j] = team[i]
    team[i] = _temp
  }

  const handleUp = i => _handle(i, i - 2)
  const handleDown = i => _handle(i, i + 2)
  const handleRight = i => _handle(i, i + 1)
  const handleLeft = i => _handle(i, i - 1)

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
      {#if (i % 2) / 2 == 0}
        <IconButton
          rounded
          src={Swap}
          title=Move
          track=swap-row
          on:click={handleRight(i)} />
        {/if}

      <AutoComplete
        rounded
        className=w-full
        items={teamItems.filter(i => !teamIds.includes(i.id))}
        placeholder='Team member {i + 1}'
        bind:selected={team[i]}
        on:change={onchange(team[i], i)} />

        {#if Math.floor(i / 2) < 2}
          <span class='translate-y-1/2' >
            <IconButton
              rounded
              src={Swap}
              track=clear-team
              title='Move Down'
              className='transform rotate-90'
              on:click={handleDown(i)} />
          </span>
        {:else}
          <span class=opacity-0> <IconButton src={Swap} /> </span>
        {/if}

    </span>
  {/each}

</div>

<style>
  span {
    @apply inline-flex gap-x-1 col-span-2
  }
</style>
