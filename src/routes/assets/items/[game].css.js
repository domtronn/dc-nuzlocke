import minifiedItems from './index.js'

import games from '$lib/data/games.json'
import leagues from '$lib/data/league.json'
import patches from '$lib/data/patches.json'

const toSet = (l) => [...new Set(l)]
  .filter(i => i)
  .sort((a, b) => a.localeCompare(b))

const extract = (id, str) => {
  try {
    const re = new RegExp(`\\.pk(item|m)-${id}{.*?}`)
    const res = re.exec(str)
    return res[0]
  } catch (e) {
    console.log('Invalid item:', id)
    return null
  }
}

export async function get ({ params }) {
  const { game } = params

  const gameData = games[game]
  const patchData = patches[game]
  if (!gameData) return { status: 404 }

  const league = leagues[gameData.lid] || leagues[gameData.pid]
  if (!league) return { status: 404 }

  const all = Object
    .values(league)
    .reduce((acc, it) => acc.concat(it.pokemon), [])

  const items = toSet(all.map(i => patchData?.item?.[i.held]?.sprite || i.held))

  const criticalCss = items.reduce((acc, it) => acc + extract(it, minifiedItems), '')

  return {
    status: 200,
    body: criticalCss.replace(/null/g, ''),
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      'Content-Type': 'text/css'
    }
  }
}
