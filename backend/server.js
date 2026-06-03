import express from "express";
import cors from "cors";

// Routes
import navigation from "./routes/navigation.route.js";
import vehicleRoutes from "./routes/vehicle.route.js"
import orderRoutes from "./routes/order.route.js"

const app = express();
const port = 8080;

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server running");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});


// Add Routes
app.use("/api/v1/", navigation);
app.use("/api/v1/", vehicleRoutes)
app.use("/api/v1/", orderRoutes)

// POST /api/route/{orderID}
// Input: orderID -> checks if we have the route
// for that order already if not, generates the route
// based on the orderID coordinates
// Returns: the route for that orderID
// Frontend displays the route for that orderID on map

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
