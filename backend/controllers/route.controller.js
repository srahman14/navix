import { fetchFromORS } from "../services/ors.service.js";
import { computeScoreRoute } from "../services/scoringEngine.service.js";

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
    console.error("Route error: " + error.message);

    res.status(500).json({ 
        success: false, 
        message: error.message 
    });
  }
}

export async function getScoreForRoute(req, res) {
  const { routes, vehicle, orders, scoringMode } = req.body;

  // Validate coordinates
  if (!routes || !vehicle || !orders ) {
    return res.status(400).json({
      success: false,
      message: "Invalid parameters - routes/vehicle/orders must all be valid",
    });
  }

  try {
    const data = await computeScoreRoute(routes, vehicle, orders, scoringMode);

    res.status(200).json({ 
        success: true, 
        content: data 
    });

  } catch (error) {
    console.error("Scoring route error: " + error.message);

    res.status(500).json({ 
        success: false, 
        message: error.message 
    });
  }
}
