export interface City {
  n: string;
  s: string;
  lat: number;
  lon: number;
}

let cache: City[] | null = null;
let inflight: Promise<City[]> | null = null;

export function loadCities(): Promise<City[]> {
  if (cache) return Promise.resolve(cache);
  if (inflight) return inflight;
  inflight = fetch("/gotovyplan/cities.json")
    .then((r) => {
      if (!r.ok) throw new Error("cities.json not found");
      return r.json() as Promise<City[]>;
    })
    .then((data) => {
      cache = data;
      inflight = null;
      return data;
    })
    .catch((e) => {
      inflight = null;
      throw e;
    });
  return inflight;
}

export function citiesByRegion(all: City[], region: string): City[] {
  if (!region.trim()) return [];
  return all.filter((c) => c.s === region);
}
