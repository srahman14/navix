import { fetchFromOSR } from "../services/osr.service.js";
import { ENV_VARS } from "../config/envVars.js";

export async function getRouteForCar(req, res) {
  const { coordinates } = req.body;

  // Validate coordinates
  if (!coordinates || coordinates.length < 2) {
    return res.status(400).json({
      success: false,
      message: "Invalid coordinates",
    });
  }

  try {
    const data = await fetchFromOSR(
      "https://api.openrouteservice.org/v2/directions/driving-car",
      coordinates,
    );

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
