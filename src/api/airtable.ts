export interface AirtableRecord<T> {
  id: string
  fields: T
}

interface AirtableListResponse<T> {
  records: AirtableRecord<T>[]
  offset?: string
}

export interface EventFields {
  Name:        string
  Type:        string
  Start:       string  
  End:         string  
  Location?:   string
  Description?: string
}

const BASE_ID   = import.meta.env.VITE_AIRTABLE_BASE_ID!
const TOKEN     = import.meta.env.VITE_AIRTABLE_TOKEN!
const TABLE     = 'Events'
const API_ROOT  = 'https://api.airtable.com'

if (!BASE_ID || !TOKEN) {
  throw new Error(
    'Missing VITE_AIRTABLE_BASE_ID or VITE_AIRTABLE_TOKEN in your env'
  )
}

export async function fetchEvents(
  date: string, view = 'Grid view'
): Promise<AirtableRecord<EventFields>[]> {
  const params = new URLSearchParams({
    view,
    filterByFormula: `{Date} = '${date}'`,
  })

  const url = `${API_ROOT}/v0/${BASE_ID}/${TABLE}?${params.toString()}`

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
  if (!res.ok) {
    throw new Error(`Airtable error ${res.status}`)
  }

  const json = (await res.json()) as AirtableListResponse<EventFields>
  return json.records
}
