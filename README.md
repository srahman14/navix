<div align="center">
  <img src="./frontend/public/logo_4.png" alt="navix-logo"/>

  <b> Optimize routes. Score alternatives. Explain decisions.</b>
</div>

---

# What is Navix?

Navix is a full-stack route optimization platform designed to simulate real-world logistics and routing.

It combines interactive route visualization (MapLibreGL JS) with backend optimization engines to generate, evaluate, and explain route recommendations for vehicles and delivery orders.

Navix provides **decision intelligence** helping users understand **which route is best and why**.

---

# Overview

## Frontend Decision Interface

The frontend provides a dispatcher-style dashboard where users can:

* Create and manage vehicles
* Create and assign delivery orders (to vehicles)
* Visualize routes on an interactive map (MapLibreGL JS)
* Compare alternative routes
* View route metrics and scoring
* Generate route decision reports

---

## Backend Optimization Engine

The backend processes routing and optimization logic through multiple engines:

* **Routing Engine** → Generates routes using OpenRouteService
* **Scoring Engine** → Evaluates route quality - based on route metrics (distance, duration etc.)
* **Report Engine** → Summarizes route performance
* **Explanation Engine** → Converts metrics into human-readable reasoning
* **Decision Engine** → Produces final route recommendation output

Together, these engines transform raw route data into actionable insights.

---

# Key Features

## Route Generation

Generate routes between vehicles and delivery destinations using real-world map data.

Supports:

* Single-destination routing
* Alternative route generation
* Multi-order route optimization

---

## Route Scoring

Each route is evaluated using weighted scoring based on:

* Distance
* Duration
* Vehicle capacity utilization

Navix supports:
- Relative Scoring - used when comparing alternative routes.
- Absolute Scoring - used when evaluating multi-stop routes.

---

## Route Decision Intelligence

Navix goes beyond route calculation by answering:

* Which route should be selected?
* Why is this route optimal?
* What tradeoffs exist?

This enables informed dispatch decisions.

---

## Interactive Map Visualization

Users can:

* View vehicles and orders on the map
* Inspect route geometry
* Animate route rendering
* Compare route options visually

---

## Report Generation

Generate structured route reports containing:

* Best route score
* Distance and duration
* Capacity utilization
* Route summary
* Decision recommendation

---

# Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Zustand
* MaplibreGL JS
* Framer Motion
* radix-ui
* react-hot-toast
* lucide-react
* Supabase (db/auth)

## Backend

* Node.js
* Express
* cors
* dotenv
* @mapbox/polyline
* OpenRouteService API

---

# How to Get Started

## 1. Clone Repository

```bash
git clone https://github.com/srahman14/navix.git
cd navix
```

---

## 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:3000
```

---

## 3. Setup Backend

```bash
cd backend
npm install
node ./server.js
```

Backend runs on:

```bash
http://localhost:8080
```

---

## 4. Configure Environment Variables

Create `.env` files in frontend and backend.

Example variables:

### Frontend

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Backend

```env
ORS_API_KEY=...
PORT=8080
```

---

# Core Workflow

Navix follows a multi-stage optimization workflow.


### Create Resources

* Vehicles
* Delivery Orders

Orders may optionally be assigned to vehicles.


### Generate Route

Frontend requests route generation from backend.

Routing engine returns:

* Route geometry
* Distance
* Duration
* Alternative routes 

### Score Routes

Scoring engine evaluates route quality.

Metrics include:

* Distance score
* Duration score
* Capacity penalty

### Generate Decision Intelligence

Backend generates:

* Report
* Explanation
* Final decision recommendation

### Present Decision

Frontend displays:

* Best route
* Metrics
* Recommendation
* Explanation

This creates a full decision-support pipeline.

---

# Project Structure

```bash
navix/
│
├── frontend/
│   ├── hooks/
│   ├── services/
│   └── src/
│       ├── components/
│       ├── lib/
│       ├── components/
│       ├── store/
│       └── types/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── __tests__/
│   ├── utils/
│   └── server.js
│
└── README.md
```

---

# Deplyoment
## Frontend
The frontend is deployed on Vercel.

- Framework: Next.js
- Hosting: Vercel

Environment Variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_API_URL=...
```
## Backend
The backend is deployed on Render as a Node.js Web Service.

- Runtime: Node.js (Express)
- Hosting: Render Web Service
- Entry Point: src/server.js
- Start Command: npm start

Environment Variables:
```bash
NODE_ENV=production
ORS_API_KEY=...
ORS_API_URL_CAR=...ORS API for driving-car (more info: https://openrouteservice.org/dev/#/api-docs)
FRONTEND_URL=...
PORT=8080
```

# Future Improvements

Planned features for future versions include:

* Change to current scoring model (change from arbitrary weights)
* Real-time traffic integration
* ETA prediction
* ML-based route scoring
* Fleet-wide optimization
* Historical analytics dashboard
* User groups
* Report exports (pdf/json etc.)

---

# Why Navix?

Traditional routing tools stop at route generation.

Navix continues further by adding:

* Optimization
* Explainability
* Decision support

This makes Navix not just a routing application, but an **intelligent logistics assistant**.

---

# License

MIT License
