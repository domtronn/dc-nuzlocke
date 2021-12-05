export const capitalise = ([first, ...rest], lowerRest = false) =>
  first.toUpperCase() +
  (lowerRest ? rest.join('').toLowerCase() : rest.join(''));

export const unslugify = (s = '') => s.replace(/-/g, ' ')
export const slugify = (s = '') => s.toLowerCase().replace(/ +/g, '-')

export const sanitise = (s) => s.replace(/galar/i, '').replace(/alola/i, '')
