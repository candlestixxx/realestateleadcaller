/**
 * Resolves a human-readable address into GPS coordinates.
 * Using OpenStreetMap Nominatim for the MVP (No API Key Required).
 * Rate limit: 1 request per second.
 */
export async function geocodeAddress(
    address?: string | null,
    city?: string | null,
    state?: string | null
): Promise<{ latitude: number, longitude: number } | null> {

    if (!address || !city || !state) return null;

    try {
        const query = encodeURIComponent(`${address}, ${city}, ${state}`);
        const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Jules-AI-RealEstate-Concierge/1.0'
            }
        });

        if (!res.ok) return null;

        const data = await res.json();

        if (data && data.length > 0) {
            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon)
            };
        }

        return null;
    } catch (e) {
        console.error("Geocoding failed:", e);
        return null;
    }
}
