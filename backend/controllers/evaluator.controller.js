import { getMetricsFromRoutes } from "../services/evaluator.service.js";

//           
export async function getMetrics(req, res) {
  const { routes } = req.body;

  // Validate routes exist
  if (!routes || routes.length < 1) {
    return res.status(400).json({
      success: false,
      message: "Invalid routes",
    });
  }

  try {
    const data = await getMetricsFromRoutes(routes)
    
    res.status(200).json({ 
        success: true, 
        content: data 
    });

  } catch (error) {
    console.error("Fetching metrics error: : " + error.message);

    res.status(500).json({ 
        success: false, 
        message: error.message 
    });
  }
}
