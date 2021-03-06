<script context="module">
  export const prerender = true
</script>

<script>
  import { savedGames, createGame } from '$lib/store'
  import { ScreenContainer } from '$lib/components/containers'

  import { Button, Tabs, AutoComplete, Input, Picture } from '$lib/components/core'

  import File from 'svelte-icons-pack/cg/CgFileAdd'
  import Games from '$lib/data/games.json'

  import { filterObj } from '$lib/utils/arr'

  let validGames = filterObj(Games, g => g.supported)

  let gameName = ''
  const handleNewGame = () => {
    if (!selectedGame.supported)
      return alert(`Sorry, ${selectedGame.title} is currently not supported`)

    savedGames.update(createGame(gameName, selected))
    window.location = '/game'
  }

  let hoverActive = false
  const togglehover = () => hoverActive = !hoverActive

  let selected
  const handleSelect = id => () => selected === id ? selected = null : selected = id

  let gen = 'All'
  const gens = [
    { label: 'All', val: 'All' },
    { label: 'Rom Hacks', val: 'romhack' },
  ].concat(
    ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']
      .map(l => ({ label: `Gen ${l}`, val: l }))
  )

  $: selectedGame = validGames[selected]
  $: disabled = !gameName.length || !selected
</script>

<svelte:head>
  <title>Nuzlocke Tracker | Create new game</title>
</svelte:head>

<ScreenContainer title='Select a New Nuzlocke' icon={File} className=mb-20 >
  <div class='flex flex-col sm:flex-row sm:flex-wrap sm:gap-y-4 gap-2'>
    <Input
      rounded
      placeholder=Name
      className=sm:flex-1
      bind:value={gameName}
    />

    <AutoComplete
      rounded
      placeholder=Game
      className='block sm:hidden'
      items={Object.keys(validGames)}
      label={i => i && Games[i].title}
      bind:selected={selected}
    >

      <div class='flex inline-flex gap-x-2 px-2 py-6 items-center h-auto w-full max-h-8' slot='item' let:item={i} let:label={label}>
        {#if Games[i].logo}
          <Picture
            src={Games[i].logo}
            alt={Games[i].title + ' logo'}
            className=w-12
            role=presentation
            aspect=192x96
          />
        {/if}
        {@html label}
      </div>
    </AutoComplete>

    <Button rounded disabled={disabled} on:click={handleNewGame}>
      Create game
    </Button>
  </div>

  <Tabs name='gens' className='hidden sm:flex' tabs={gens} bind:selected={gen} />

  <ul role=radiogroup aria-labelledby=sc_title
      class='grid items-center justify-center gap-x-4 gap-y-6 grid-cols-3 sm:grid-cols-4 hidden sm:grid'>
    {#each Object.entries(validGames) as [id, game]}
      {#if game.logo && (gen === 'All' || game.gen === gen) }
        <li
          role=radio
          aria-checked={selected === id}

          title='Pokemon {game.title}'
          on:click={handleSelect(id)}
          on:mouseenter={togglehover}
          on:mouseleave={togglehover}
          class='group w-full text-center text-xs hover:text-yellow-500 dark:hover:text-yellow-300 transition-colors font-medium text-wrap cursor-pointer'
          class:dark:text-yellow-300={selected === id}
          class:text-yellow-500={selected === id}
        >
          <Picture
            src={game.logo}
            aspect=192x96
            role=presentation
            alt={'Pokémon ' + game.title + ' logo'}
            className='w-24 mb-2 mx-auto transition group-hover:grayscale-0 {(selected && selected !== id) || hoverActive ? 'grayscale' : ''} {selected === id ? 'drop-shadow-highlight grayscale-0' : ''} cursor-pointer'
            />
          <strong>{game.title}</strong>
        </li>
      {/if}
    {/each}
  </ul>

</ScreenContainer>

<div class='h-28 w-8' ></div>
