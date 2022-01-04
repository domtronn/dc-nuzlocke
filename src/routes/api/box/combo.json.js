import { Combination } from './_combo'
import { moveResistance } from '../battle/advice.json/_type-advice.js'

import { types } from '$lib/data/types'
import { difference } from '$lib/utils/arr'

const pickTop = (arr, prop, order = 'asc', secprop, slice = 1) => arr
  .sort(order === 'desc'
        ? (a, b) => b[prop] === a[prop]
          ? secprop
            ? b[secprop] === a[secprop]
              ? b.total - a.total
              : b[secprop] - a[secprop]
            : b.total - a.total
          : b[prop] - a[prop]
        : (a, b) => b[prop] === a[prop]
          ? secprop
            ? b[secprop] === a[secprop]
              ? b.total - a.total
              : a[secprop] - b[secprop]
            : b.total - a.total
          : a[prop] - b[prop])
  .slice(0, slice)

export async function post ({ body }) {
  const { box, take = 20 } = body

  const now = new Date()
  if (!box || !box.length) return { status: 400 }

  const data = box
    .sort((a, b) => b.total - a.total)
    .slice(0, take)
    .map(p => {
      const dmg = types.map(type => [ type, moveResistance(type, p.types) ])
      const [weak, resist] = dmg
        .reduce(([weak, resist], [type, i]) => {
          if (i > 1) return [weak.concat(type), resist]
          if (i < 1) return [weak, resist.concat(type)]
          return [weak, resist]
        }, [[], []])

      return { name: p.alias, total: p.total, weak, resist }
    })

  const c = new Combination(data, 6)
  const teams = Array(c.length)
    .fill()
    .map((_, i) => {
      const team = c.comb(i).map(id => c.seed[id])

      const total = team.reduce((acc, it) => acc + it.total, 0)
      const resist = team.map(t => t.resist).flat()
      const weak = team.map(t => t.weak).flat()

      const dresist = [...new Set(resist)]
      const dweak = [...new Set(weak)]

      const uncovered = difference(dweak, dresist)

      return {
        total,
        team: team.map(i => i.name),
        weak: weak.length, dweak: dweak.length,
        resist: resist.length, dresist: dresist.length,
        uncovered: uncovered.length,
        types: {
          resist: dresist,
          weak: dweak,
          uncovered
        }
      }
    })

  const result = {
    analysed: c.length,
    time: new Date() - now,
    coverage: pickTop(teams, 'uncovered', 'asc'),
    weakness: pickTop(teams, 'dweak', 'asc'),
    resistances: pickTop(teams, 'dresist', 'desc'),
  }

  return { body: result }
}
