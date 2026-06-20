import { generateRouteExplanation } from "../services/explanation.service.js";

export async function getRouteExplanation(req, res) {
  const {
    routes,
    vehicle,
    orders,
    scoringMode = "absolute",
  } = req.body;

  if (!routes || !vehicle || !orders) {
    return res.status(400).json({
      success: false,
      message: "routes, vehicle and orders are required",
    });
  }

  try {
    const explanation = await generateRouteExplanation(
      routes,
      vehicle,
      orders,
      scoringMode
    );

    return res.status(200).json({
      success: true,
      content: explanation,
    });
  } catch (error) {
    console.error("Explanation engine error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}