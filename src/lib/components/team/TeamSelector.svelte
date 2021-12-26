<script>
  import { createEventDispatcher } from 'svelte'
  import { browser } from '$app/env'
  import { activeGame, getGame, read } from '$lib/store'
  import { sanitise, capitalise } from '$lib/utils/string'

  import { AutoComplete, IconButton, Tabs } from '$lib/components/core'
  import Bin from 'svelte-icons-pack/ai/AiOutlineStop'
  import Swap from 'svelte-icons-pack/io/IoSwapHorizontal'
  import Flip from 'svelte-icons-pack/cg/CgEditFlipH'

  /** Trainer data */
  const fliptrainer =_ => flipped = !flipped
  export let flipped = false

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
  const flipteam = i => _ => team[i].flipped = !team[i]?.flipped

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

  export let trainer = trainers[0]
  $: trainer, console.log(trainer)
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
  <span class='mx-auto flex items-center gap-x-6'>
    <Tabs
      name=trainer
      tabs={['Lucas', 'Dawn']}
      select={i => i}
      bind:selected={trainer}
      />

    <IconButton
      rounded
      src={Flip}
      title=Flip
      containerClassName='mr-4 sm:ml-4'
      on:click={fliptrainer} />

  </span>
  <div class=col-span-1 />

  {#each team.slice(0, Math.min(teamItems.length) || 6) as t, i}
    <span class:lg:flex-row-reverse={i % 2 == 0}>

      <AutoComplete
        rounded
        className=w-full
        items={teamItems.filter(i => !teamIds.includes(i.id))}
        placeholder='Team member {i + 1}'
        bind:selected={team[i]}
        on:change={onchange(team[i], i)} />

        <IconButton
          rounded
          src={Bin}
          on:click={clearteam(i)}
        />

        <IconButton
          rounded
          src={Flip}
          on:click={flipteam(i)}
        />

    </span>
  {/each}

</div>

<style>
  span {
    @apply inline-flex gap-x-1 col-span-2
  }
</style>
