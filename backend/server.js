import express from "express";
import cors from "cors";

// Routes
import route from "./routes/route.route.js";
const app = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server running");
});

// POST /api/route
// Input: coordinates [lng, lat]
// Returns: route (geometry)
// Frontend displays the route on the map
app.use("/api/v1/", route);

// POST /api/route/{orderID}
// Input: orderID -> checks if we have the route
// for that order already if not, generates the route
// based on the orderID coordinates
// Returns: the route for that orderID
// Frontend displays the route for that orderID on map

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
