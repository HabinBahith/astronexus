const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY ?? "DEMO_KEY";

export type NeoCloseApproach = {
  date: string;
  epoch_date_close_approach: number;
  relative_velocity_km_s: number;
  relative_velocity_miles_per_hour: number;
  miss_distance_km: number;
  miss_distance_au: number;
  orbiting_body: string;
};

export type OrbitalElements = {
  semi_major_axis_au?: number;
  eccentricity?: number;
  inclination_deg?: number;
  ascending_node_deg?: number;
  perihelion_time?: string;
  period_years?: number;
};

export type NeoItem = {
  id: string;
  name: string;
  nasa_jpl_url?: string;
  absolute_magnitude_h?: number;
  estimated_diameter_m_min?: number;
  estimated_diameter_m_max?: number;
  estimated_diameter_km_min?: number;
  estimated_diameter_km_max?: number;
  is_potentially_hazardous_asteroid?: boolean;
  close_approach_data: NeoCloseApproach[];
  orbital_data?: OrbitalElements;
  first_observation_date?: string;
  last_observation_date?: string;
};

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed ${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

// Browse endpoint: returns pages of NEOs. We'll fetch first page(s) and locally filter by name.
export async function fetchNeosByQuery(query: string, pageLimit = 2): Promise<NeoItem[]> {
  const q = query.trim().toLowerCase();
  const results: NeoItem[] = [];

  for (let page = 0; page < pageLimit; page++) {
    const url = `https://api.nasa.gov/neo/rest/v1/neo/browse?page=${page}&size=20&api_key=${NASA_API_KEY}`;
    const data = await fetchJson<any>(url);
    const neos = (data?.near_earth_objects ?? []) as any[];

    for (const n of neos) {
      const name = (n?.name ?? "").toLowerCase();
      if (!q || name.includes(q)) {
        results.push(mapNeo(n));
      }
    }
  }

  return results;
}

// Feed endpoint: get objects for a date range (YYYY-MM-DD)
export async function fetchNeoFeed(startDate: string, endDate?: string): Promise<NeoItem[]> {
  const end = endDate ?? startDate;
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${end}&api_key=${NASA_API_KEY}`;
  const data = await fetchJson<any>(url);
  const byDate = data?.near_earth_objects ?? {};
  const out: NeoItem[] = [];

  for (const date of Object.keys(byDate)) {
    const list = byDate[date] as any[];
    for (const n of list) {
      out.push(mapNeo(n));
    }
  }

  return out;
}

function mapNeo(n: any): NeoItem {
  const diamMeters = n?.estimated_diameter?.meters ?? {};
  const diamKm = n?.estimated_diameter?.kilometers ?? {};
  const orbital = n?.orbital_data ?? {};
  
  const close = (n?.close_approach_data ?? []).map((c: any) => ({
    date: c?.close_approach_date ?? c?.close_approach_date_full ?? "",
    epoch_date_close_approach: c?.epoch_date_close_approach ?? 0,
    relative_velocity_km_s: Number(c?.relative_velocity?.kilometers_per_second ?? 0),
    relative_velocity_miles_per_hour: Number(c?.relative_velocity?.miles_per_hour ?? 0),
    miss_distance_km: Number(c?.miss_distance?.kilometers ?? 0),
    miss_distance_au: Number(c?.miss_distance?.astronomical ?? 0),
    orbiting_body: c?.orbiting_body ?? "",
  }));

  return {
    id: String(n?.id ?? n?.neo_reference_id ?? ""),
    name: n?.name ?? "",
    nasa_jpl_url: n?.nasa_jpl_url,
    absolute_magnitude_h: n?.absolute_magnitude_h,
    estimated_diameter_m_min: diamMeters?.estimated_diameter_min ?? diamMeters?.min ?? undefined,
    estimated_diameter_m_max: diamMeters?.estimated_diameter_max ?? diamMeters?.max ?? undefined,
    estimated_diameter_km_min: diamKm?.estimated_diameter_min ?? diamKm?.min ?? undefined,
    estimated_diameter_km_max: diamKm?.estimated_diameter_max ?? diamKm?.max ?? undefined,
    is_potentially_hazardous_asteroid: Boolean(n?.is_potentially_hazardous_asteroid),
    close_approach_data: close,
    orbital_data: {
      semi_major_axis_au: orbital?.semi_major_axis_au,
      eccentricity: orbital?.eccentricity,
      inclination_deg: orbital?.inclination_deg,
      ascending_node_deg: orbital?.ascending_node_deg,
      perihelion_time: orbital?.perihelion_time,
      period_years: orbital?.orbital_period_years,
    },
    first_observation_date: n?.orbital_data?.first_observation_date,
    last_observation_date: n?.orbital_data?.last_observation_date,
  };
}
