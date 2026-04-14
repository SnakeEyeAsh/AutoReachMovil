const WIKI_SEARCH = 'https://en.wikipedia.org/w/api.php'

const WIKI_HEADERS = {
  'User-Agent': 'AutoReachApp/1.0 (autoreach@example.com)',
}

async function searchWikipediaTitle(marca: string, modelo: string, año: number): Promise<string | null> {
  const query = año > 0 ? `${marca} ${modelo} ${año}` : `${marca} ${modelo}`
  const params = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: query,
    format: 'json',
    origin: '*',
    srlimit: '1',
  })

  const response = await fetch(`${WIKI_SEARCH}?${params}`, { headers: WIKI_HEADERS })
  if (!response.ok) return null

  const json = await response.json()
  return json?.query?.search?.[0]?.title ?? null
}

async function getWikipediaThumbnail(title: string, año: number): Promise<string | null> {
  const params = new URLSearchParams({
    action: 'query',
    titles: title,
    prop: 'images',
    imlimit: '20',
    format: 'json',
    origin: '*',
  })

  const response = await fetch(`${WIKI_SEARCH}?${params}`, { headers: WIKI_HEADERS })
  if (!response.ok) return null

  const json = await response.json()
  const pages = json?.query?.pages ?? {}
  const page = Object.values(pages)[0] as any
  const images: any[] = page?.images ?? []

  // Filtra solo archivos de imagen reales (jpg/png), excluye iconos y logos
  const carImages = images.filter((img: any) => {
    const name: string = img.title?.toLowerCase() ?? ''
    return (name.endsWith('.jpg') || name.endsWith('.png'))
      && !name.includes('logo')
      && !name.includes('icon')
      && !name.includes('flag')
      && !name.includes('badge')
  })

  if (carImages.length === 0) return null

  // Busca imagen cuyo nombre contenga el año, si no usa la segunda o la primera
  const yearMatch = año > 0
    ? carImages.find((img: any) => img.title?.includes(String(año)))
    : null
  const chosen = yearMatch ?? carImages[1] ?? carImages[0]

  // Obtiene la URL real del archivo
  const fileParams = new URLSearchParams({
    action: 'query',
    titles: chosen.title,
    prop: 'imageinfo',
    iiprop: 'url',
    iiurlwidth: '800',
    format: 'json',
    origin: '*',
  })

  const fileResponse = await fetch(`${WIKI_SEARCH}?${fileParams}`, { headers: WIKI_HEADERS })
  if (!fileResponse.ok) return null

  const fileJson = await fileResponse.json()
  const filePages = fileJson?.query?.pages ?? {}
  const filePage = Object.values(filePages)[0] as any
  const url = filePage?.imageinfo?.[0]?.thumburl ?? filePage?.imageinfo?.[0]?.url ?? null
  if (!url) return null

  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`
}

export async function fetchCarPhotos(marca: string, modelo: string, año: number): Promise<string[]> {
  if (!marca || !modelo) return []

  const title = await searchWikipediaTitle(marca, modelo, año)
  if (!title) return []

  const url = await getWikipediaThumbnail(title, año)
  if (!url) return []

  return [url]
}
