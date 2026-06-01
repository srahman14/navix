import { reverseGeocode } from "../services/reverseGeocoding.service.js";

export async function getLocationDetails(req, res) {
  console.log("req body: ", req.body)
  console.log("req header: ", req.header)

  const { coordinates } = req.body;


  // Validate coordinates array has at least one location [lng, lat]
  if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 1) {
    return res.status(400).json({
      success: false,
      message: "Invalid coordinates. Expected array of [lng, lat] pairs",
    });
  }

  try {
    // Coordinates are in [lng, lat]
    const locations = coordinates.map(coord => {
      if (!Array.isArray(coord) || coord.length !== 2) {
        throw new Error("Each coordinate must be [lng, lat]");
      }
      const [lng, lat] = coord;
      return reverseGeocode(lat, lng);
    });

    const data = await Promise.all(locations);

    res.status(200).json({ 
        success: true, 
        content: data.length === 1 ? data[0] : data
    });

  } catch (error) {
    console.error("Fetching location details error: " + error.message);

    res.status(500).json({ 
        success: false, 
        message: error.message 
    });
  }
}
