import { fetchFromORS } from "../services/ors.service.js";

export async function getRouteForProfile(req, res) {
  const { coordinates, profile = "driving-car" } = req.body;

  // Validate coordinates
  if (!coordinates || coordinates.length < 2) {
    return res.status(400).json({
      success: false,
      message: "Invalid coordinates",
    });
  }

  try {
    const data = await fetchFromORS(profile, coordinates);

    res.status(200).json({ 
        success: true, 
        content: data 
    });

  } catch (error) {
    console.error(errorText)
    console.error("Route error: " + error.message);

    res.status(500).json({ 
        success: false, 
        message: error.message 
    });
  }
}
