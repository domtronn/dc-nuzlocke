export const capitalise = (str, lowerRest = false) => {
  if (!str) return ''
  const [first, ...rest] = str
  return first.toUpperCase() +
    (lowerRest ? rest.join('').toLowerCase() : rest.join(''));
}

export const unslugify = (s = '') => s.replace(/-/g, ' ')
export const slugify = (s = '') => s.toLowerCase().replace(/ +/g, '-')

export const toKebabCase = str =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('-');

export const toSlug = (str = '') =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const toId = {
  encounter: type => toSlug(type + ' encounters'),
  boss: (boss, name) => toSlug(boss + ' ' + name),
}

export const toList = (arr, f = i => i, and = '&') => {
  const front = arr.slice(0, -1)
  const last = arr.slice(-1)[0]
  return front.map(f).join(', ') + (front.length ? ` ${and} ` : '') + f(last)
}
