import tiny from 'tinyurl'

export async function post ({ body, host }) {
  const url = await tiny.shorten(body.url)

  return {
    status: 200,
    body: { url: url.replace('tinyurl.com', host + '/drop') }
  }
}
