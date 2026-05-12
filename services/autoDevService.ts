const WIKI_SEARCH = 'https://en.wikipedia.org/w/api.php'

const WIKI_HEADERS = {
  'User-Agent': 'AutoReachApp/1.0 (autoreach@example.com)',
}

async function searchWikipediaTitle(marca: string, modelo: string, año: number): Promise<string | null> {
  const queries = año > 0
    ? [`${marca} ${modelo} ${año}`, `${marca} ${modelo} automobile`, `${marca} ${modelo}`]
    : [`${marca} ${modelo} automobile`, `${marca} ${modelo} car`, `${marca} ${modelo}`]

  for (const query of queries) {
    const params = new URLSearchParams({
      action: 'query',
      list: 'search',
      srsearch: query,
      format: 'json',
      origin: '*',
      srlimit: '5',
    })

    const response = await fetch(`${WIKI_SEARCH}?${params}`, { headers: WIKI_HEADERS })
    if (!response.ok) continue

    const json = await response.json()
    const results: any[] = json?.query?.search ?? []

    // Prefer a title that contains the brand or model name
    const marcaL = marca.toLowerCase()
    const modeloL = modelo.toLowerCase()
    const best = results.find((r: any) => {
      const t: string = r.title?.toLowerCase() ?? ''
      return t.includes(marcaL) || t.includes(modeloL)
    })

    const chosen = best ?? results[0]
    if (chosen?.title) return chosen.title
  }

  return null
}

async function getPageImage(title: string): Promise<string | null> {
  // Primary: pageimages returns the article's lead image directly
  const params = new URLSearchParams({
    action: 'query',
    titles: title,
    prop: 'pageimages',
    piprop: 'thumbnail|original',
    pithumbsize: '800',
    pilicense: 'any',
    format: 'json',
    origin: '*',
  })

  const response = await fetch(`${WIKI_SEARCH}?${params}`, { headers: WIKI_HEADERS })
  if (!response.ok) return null

  const json = await response.json()
  const pages = json?.query?.pages ?? {}
  const page = Object.values(pages)[0] as any
  const url =
    page?.thumbnail?.source ??
    page?.original?.source ??
    null

  return url ? `https://images.weserv.nl/?url=${encodeURIComponent(url)}` : null
}

async function getPageImageFallback(title: string, año: number): Promise<string | null> {
  // Fallback: enumerate images listed on the page and resolve the first good one
  const params = new URLSearchParams({
    action: 'query',
    titles: title,
    prop: 'images',
    imlimit: '30',
    format: 'json',
    origin: '*',
  })

  const response = await fetch(`${WIKI_SEARCH}?${params}`, { headers: WIKI_HEADERS })
  if (!response.ok) return null

  const json = await response.json()
  const pages = json?.query?.pages ?? {}
  const page = Object.values(pages)[0] as any
  const images: any[] = page?.images ?? []

  const carImages = images.filter((img: any) => {
    const name: string = img.title?.toLowerCase() ?? ''
    return (name.endsWith('.jpg') || name.endsWith('.png') || name.endsWith('.jpeg'))
      && !name.includes('logo')
      && !name.includes('icon')
      && !name.includes('flag')
      && !name.includes('badge')
      && !name.includes('map')
      && !name.includes('coat')
  })

  if (carImages.length === 0) return null

  const yearMatch = año > 0
    ? carImages.find((img: any) => img.title?.includes(String(año)))
    : null
  const chosen = yearMatch ?? carImages[1] ?? carImages[0]

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

  const url = (await getPageImage(title)) ?? (await getPageImageFallback(title, año))
  if (!url) return []

  return [url]
}
