import { generateRouteDecision } from "../services/decisionEngine.service.js";

export async function getRouteDecision(req, res) {
  const {
    routes,
    vehicle,
    orders,
    scoringMode = "absolute",
  } = req.body;

  if (!routes || !vehicle || !orders) {
    return res.status(400).json({
      success: false,
      message: "routes, vehicle, orders required",
    });
  }

  try {
    const decision = await generateRouteDecision(
      routes,
      vehicle,
      orders,
      scoringMode
    );

    return res.status(200).json({
      success: true,
      content: decision,
    });
  } catch (error) {
    console.error("Decision engine error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}