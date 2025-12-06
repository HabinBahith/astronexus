export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  source: "nasa" | "esa" | "jwst";
  sourceUrl?: string;
}

const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY;
const ESA_API_KEY = import.meta.env.VITE_ESA_API_KEY || "";
const JWST_API_KEY = import.meta.env.VITE_JWST_API_KEY || "";

async function fetchWithTimeout(
  url: string,
  timeoutMs = 8000
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

// NASA APOD API
async function fetchNASAImages(query: string): Promise<GalleryImage[]> {
  try {
    if (!NASA_API_KEY) {
      console.warn("NASA API key not configured");
      return [];
    }

    // NASA doesn't have a direct search API for APOD, so we'll use their library API
    const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`;
    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`);
    }

    const data = await response.json();
    const items = data.collection?.items || [];

    return items.slice(0, 10).map((item: any) => ({
      id: item.data?.[0]?.nasa_id || Math.random().toString(),
      title: item.data?.[0]?.title || "Untitled",
      description: item.data?.[0]?.description || "No description available",
      imageUrl:
        item.links?.[0]?.href ||
        (item.data?.[0]?.media_type === "image"
          ? item.href
          : ""),
      date: item.data?.[0]?.date_created || new Date().toISOString(),
      source: "nasa" as const,
      sourceUrl: `https://images.nasa.gov/details/${item.data?.[0]?.nasa_id}`,
    }));
  } catch (error) {
    console.error("Error fetching NASA images:", error);
    return [];
  }
}

// ESA API
async function fetchESAImages(query: string): Promise<GalleryImage[]> {
  try {
    // ESA Hubble Heritage provides high-quality images
    const url = `https://hubblesite.org/api/v3/images?search=${encodeURIComponent(query)}`;
    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error(`ESA API error: ${response.status}`);
    }

    const data = await response.json();

    return (data || []).slice(0, 10).map((item: any) => ({
      id: item.id || Math.random().toString(),
      title: item.name || "Untitled",
      description: item.short_description || item.description || "No description",
      imageUrl: item.image_files?.[0]?.file_url || "",
      date: item.publication_date || new Date().toISOString(),
      source: "esa" as const,
      sourceUrl: item.stsci_id
        ? `https://hubblesite.org/contents/media/${item.id}`
        : undefined,
    }));
  } catch (error) {
    console.error("Error fetching ESA images:", error);
    return [];
  }
}

// JWST API
async function fetchJWSTImages(query: string): Promise<GalleryImage[]> {
  try {
    // JWST uses the same NASA images API but with JWST-specific filters
    const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&yearBegin=2022&media_type=image`;
    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error(`JWST API error: ${response.status}`);
    }

    const data = await response.json();
    const items = data.collection?.items || [];

    return items
      .filter(
        (item: any) =>
          item.data?.[0]?.keywords?.some((k: string) =>
            k?.toLowerCase().includes("jwst")
          ) ||
          item.data?.[0]?.title?.toLowerCase().includes("james webb") ||
          item.data?.[0]?.description?.toLowerCase().includes("james webb")
      )
      .slice(0, 10)
      .map((item: any) => ({
        id: item.data?.[0]?.nasa_id || Math.random().toString(),
        title: item.data?.[0]?.title || "Untitled",
        description: item.data?.[0]?.description || "No description available",
        imageUrl:
          item.links?.[0]?.href ||
          (item.data?.[0]?.media_type === "image" ? item.href : ""),
        date: item.data?.[0]?.date_created || new Date().toISOString(),
        source: "jwst" as const,
        sourceUrl: `https://images.nasa.gov/details/${item.data?.[0]?.nasa_id}`,
      }));
  } catch (error) {
    console.error("Error fetching JWST images:", error);
    return [];
  }
}

export async function fetchSpaceImages(
  query: string,
  source: "all" | "nasa" | "esa" | "jwst" = "all"
): Promise<GalleryImage[]> {
  if (!query.trim()) {
    throw new Error("Search query cannot be empty");
  }

  try {
    const results: GalleryImage[] = [];

    if (source === "nasa" || source === "all") {
      const nasaImages = await fetchNASAImages(query);
      results.push(...nasaImages);
    }

    if (source === "esa" || source === "all") {
      const esaImages = await fetchESAImages(query);
      results.push(...esaImages);
    }

    if (source === "jwst" || source === "all") {
      const jwstImages = await fetchJWSTImages(query);
      results.push(...jwstImages);
    }

    // Remove duplicates based on title similarity
    const uniqueResults = Array.from(
      new Map(
        results.map((img) => [
          img.title.toLowerCase().trim(),
          img,
        ])
      ).values()
    );

    return uniqueResults.sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch space images";
    throw new Error(message);
  }
}
