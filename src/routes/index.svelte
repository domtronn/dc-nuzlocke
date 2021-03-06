<script context='module'>
  export const router = false
</script>

<script>
  export let id = 25

  import { SPRITE } from '$utils/rewrites'

  import { flip as animflip } from 'svelte/animate'
  import { fly } from 'svelte/transition'
  import { onMount } from 'svelte'

  import { readdata, activeGame, savedGames, parse, getGame, read, summarise } from '$lib/store'
  import { PixelatedContainer } from '$lib/components/containers'

  import { Picture, PIcon } from '$lib/components/core'


  import Icon from 'svelte-icons-pack'
  import Deceased from 'svelte-icons-pack/fa/FaSolidSkullCrossbones'

  const interval = 5000
  const distance = 300

  let hovering = false
  const toggleHover = () => hovering = !hovering

  const dur = d => 10 * Math.sqrt(d)

  let flip = 0
  setInterval(() => {
    flip = (flip + 1) % 2
    id = Math.round(Math.random() * 151)
  }, interval)

  let activeId, active = {}, summary = {}
  let links = [
    { title: 'New Game', href: '/new', color: 'blue' },
    { title: 'Load Game', href: '/saves', color: 'pink' },
    { title: 'Guides', href: '/guides', color: 'green' }
  ]

  onMount(() => {
    const [data,,id, save] = readdata()
    activeId = id
    active = save
    summarise(data => summary = data)(data)

    if (active) {
      links = [
        { title: 'Continue', href: '/game', color: 'yellow' },
        ...links
      ]
    }
  })

  $: duration = Math.min(interval / 3, 1000)
  $: src = `${SPRITE}/${id}.png?auto=format`
</script>

<main>
  <h1 role=heading aria-level=1 class='mx-auto text-center font-mono text-4xl'>
    Pokémon
    <Picture
      src=/logo
      aspect=324x62
      pixelated
      alt='Nuzlocke logo'
      className='transition h-auto md:h-16 mt-2 mx-auto {hovering ? '' : 'md:grayscale'}'
    />
    tracker
  </h1>

  <div>
    <PixelatedContainer className=container__index>

      <div class='font-bold flex flex-col h-36 justify-center'>

        {#each links as { title, href, color } (href)}
          <a animate:animflip in:fly={{ x: -50 }}
             class='group tracking-widest hover:drop-shadow-text {color}'
             on:mouseenter={toggleHover}
             on:mouseleave={toggleHover}
             {href}
             sveltekit:prefetch
             rel=external
           >
            {title}
            {#if title === 'Continue'}
              <div class='flex flex-row group-hover:grayscale-0 md:grayscale items-center transition h-8 -mt-1 font-sans text-sm font-normal'>
                <Picture
                  src=/assets/{active.game}
                  alt='{active.game} logo'
                  className=mr-2
                  aspect=32xauto
                  />

                <span>{summary.available.length}</span>
                <PIcon className='transform scale-75 -ml-1' type='item' name='poke-ball' />
                <span>{summary.deceased.length}</span>
                <Icon className='ml-1 w-3 h-3 fill-current' src={Deceased} />
              </div>
            {/if}
          </a>
        {/each}

        <!-- <span> -->
        <!--   <button class='tracking-widest hover:drop-shadow-text hover:text-orange-400' on:mouseenter={toggleHover} on:mouseleave={toggleHover}> -->
        <!--     Settings -->
        <!--   </button> -->
        <!--   <\!-- TODO: Rules -\-> -->
        <!-- </span> -->

      </div>

      <div class='img__container h-full -mx-12 relative'>
        {#if !flip}
          <img {src} rel=external alt='Pokemon #{id}'
               class='absolute transition right-0 w-full -my-2 md:-my-12 -ml-12'
               class:md:grayscale={!hovering}
               out:fly={{ y: distance, duration }}
               in:fly={{ y: -distance, duration }}
             />
        {/if}
        {#if flip}
          <img {src} rel=external alt='Pokemon #{id}'
               class='absolute transition right-0 w-full -my-2 md:-my-12 -ml-12'
               class:md:grayscale={!hovering}
               out:fly={{ y: distance, duration }}
               in:fly={{ y: -distance, duration }}
             />
        {/if}
      </div>
    </PixelatedContainer>
  </div>

  <p>
    Keep track of your Pokémon encounters across multiple Nuzlocke
    runs, and prepare for Gym battles and Rival fights so you never
    wipe again! Get insights into team match ups, compare stat
    blocks and get detail on Gym movesets & abilities.
  </p>

</main>

<style>
  main {
    @apply container mx-auto flex flex-col justify-center mt-16
  }

  @media (min-width:640px) {
    main {
      @apply absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 -mt-8;
    }
  }

  @media (min-height:700px) {
    main {
      @apply absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 -mt-8;
    }
  }

  main > div { @apply py-7 px-6 sm:px-4 overflow-hidden mt-10; }

  p {
    @apply max-w-lg mt-4 mx-auto text-center leading-4 text-tiny text-gray-900 px-4
  }

  :global(.dark) p {
    @apply text-gray-400
  }

  :global(.container__index) {
    @apply font-mono relative max-h-48 max-w-md mx-auto flex sm:flex-row justify-evenly items-center gap-y-2 text-3xl py-8 h-full w-auto;
  }

  @media (max-width:640px) {
    :global(.container__index > div) {
      @apply -ml-8;
    }
  }

  .img__container {
    @apply -mt-32;
    width: theme('spacing.32');
  }

  @media (min-width: 640px) {
    .img__container {
      width: theme('spacing.52');
    }
  }

  img {
    image-rendering: pixelated;
    transition-duration: 300ms !important;
  }

  .pink { @apply hover:text-pink-500 }
  .blue { @apply hover:text-blue-400 }
  .green { @apply hover:text-green-400 }
  .yellow { @apply hover:text-yellow-400 }
</style>
