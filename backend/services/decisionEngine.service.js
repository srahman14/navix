// Merge of reportGenerator service + explanationEngine service 

import { generateRouteExplanation } from "./explanation.service.js";
import { generateRouteReport } from "./reportGenerator.service.js";


export const generateRouteDecision = async (
  routes,
  vehicle,
  orders,
  scoringMode = "absolute"
) => {
  if (!routes || !vehicle || !orders) {
    throw new Error("Routes, vehicle, and orders required");
  }

  const report = await generateRouteReport(
    routes,
    vehicle,
    orders,
    scoringMode
  );

  const explanation = await generateRouteExplanation(
    routes,
    vehicle,
    orders,
    scoringMode
  );

  return {
    report,
    explanation,
    generatedAt: new Date().toISOString(),
  };
};