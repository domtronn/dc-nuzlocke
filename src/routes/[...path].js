export async function get ({ params }) {
  return {
    status: 301,
    headers: {
      Location: `https://nuzlocke.app/${params.path}`
    }
  }
}
