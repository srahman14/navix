export async function reverseGeocode(lat, lng) {
  if (!lat || !lng) {
    throw new Error("Latitude and longitude are required");
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      {
        headers: {
          "User-Agent": "Navix Route Optimizer"
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Nominatim API failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.address) {
      throw new Error("No address found for coordinates");
    }

    // Extract location details with fallbacks
    const address = data.address;
    const locality = address.city || address.town || address.village || "Unknown";
    const region = address.state || address.county || "";
    const country = address.country || "Unknown";

    return {
      locality,
      region,
      country,
      display_name: data.display_name,
      coordinates: { lat, lng }
    };
  } catch (err) {
    console.error("Reverse geocoding failed:", err);
    throw err;
  }
}