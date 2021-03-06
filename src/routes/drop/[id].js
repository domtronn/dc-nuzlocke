import https from 'https'

const opts = {
  method: 'GET',
  hostname: 'tinyurl.com',
  port: 443
}

export async function get ({ params, host }) {
  return new Promise(resolve => {
    const req = https.request(
      { ...opts, path: '/' + params.id },
      res => {
        let { location } = res.headers

        if (host.startsWith('localhost')) {
          location = location.replace(/.*?\/drop/, `http://${host}/drop`)
        }

        if (!location) return resolve({ status: 404 })
        if (!location.includes(`://${host}`)) return resolve({ status: 400 })

        return resolve({
          status: 301,
          headers: {
            Location: location
          }
        })
      }
    )

    req.end()
  })
}
