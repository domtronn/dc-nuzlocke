import Games from '$lib/data/games.json'

import Pokemon from 'pokemon-assets/assets/data/pokemon.json'

export async function get ({ params }) {
  const { logo } = params

  let path = ''
  if (Games[logo]) path = Games[logo].logo

  const pkmn = Object.values(Pokemon).find(i => i.name === logo || i.alias === logo || i.sprite === logo)
  if (pkmn) path = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pkmn.num}`

  if (!path) return { status: 404 }

  return {
    status: 301,
    headers: {
      Location: path + '.png'
    }
  }
}
