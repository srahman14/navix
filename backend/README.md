# Navix Backend

Express.js server that powers the Navix vehicle routing optimization system. This backend provides REST APIs for route calculation using OpenRouteService (OSR), vehicle and order management, and route optimization.

## Features

- **Route Calculation API** - Calculate optimized routes between multiple coordinates
- **OpenRouteService Integration** - Leverage OSR for directions and routing
- **Alternative Routes** - Generate and return 3 alternative route options
- **Polyline Encoding** - Efficient geometry compression for API responses
- **Environment-based Configuration** - Secure API key management
- **Input Validation** - Comprehensive validation for route requests
- **Error Handling** - Structured error responses with proper HTTP status codes
- **CORS Support** - Cross-origin requests enabled for frontend

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- OpenRouteService API key

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
NEXT_PUBLIC_OSR_API_KEY=your_openrouteservice_api_key_here
PORT=8080
NODE_ENV=development
```

**Note**: The API key is prefixed with `NEXT_PUBLIC_` to be accessible from the frontend as well.

### Development

```bash
npm run dev
```

The server will start on `http://localhost:8080`

### Production

```bash
npm start
```

## API Documentation

### Route Calculation Endpoint

#### POST `/api/v1/route`

Calculate optimized routes between multiple coordinates using OpenRouteService.

**Request Body:**
```json
{
  "coordinates": [
    [longitude, latitude],
    [longitude, latitude]
  ]
}
```

**Example:**
```bash
curl -X POST http://localhost:8080/api/v1/route \
  -H "Content-Type: application/json" \
  -d '{
    "coordinates": [
      [-0.1182, 51.4971],
      [-0.0890, 51.5199]
    ]
  }'
```

**Query Parameters:**
- `elevation=true` (optional) - Include elevation data in route
- `weight_factor=1.4` (default) - Weight factor for alternative routes

**Response:**
```json
{
  "bbox": [minLng, minLat, maxLng, maxLat],
  "metadata": {
    "attribution": "OpenRouteService",
    "service": "routing",
    "timestamp": 1234567890,
    "query": { "coordinates": [...] }
  },
  "routes": [
    {
      "summary": {
        "distance": 1234,
        "duration": 456
      },
      "geometry": {
        "encoded": "encoded_polyline_string",
        "decoded": [[lng, lat], [lng, lat], ...]
      },
      "segments": [...],
      "way_points": [0, n]
    },
    // ... up to 3 alternative routes
  ]
}
```

**Response Fields:**
- `bbox` - Bounding box for map fit bounds
- `routes[]` - Array of route options (up to 3)
  - `summary.distance` - Distance in meters
  - `summary.duration` - Duration in seconds
  - `geometry.encoded` - Polyline-encoded geometry (compact format)
  - `geometry.decoded` - Full coordinate array
  - `segments[]` - Route segment details
  - `way_points[]` - Indices of waypoint positions in geometry

**Status Codes:**
- `200 OK` - Route calculated successfully
- `400 Bad Request` - Invalid input (missing/invalid coordinates)
- `500 Internal Server Error` - Server or OSR service error

**Error Response:**
```json
{
  "error": "Error message describing the issue"
}
```

## Project Structure

```
backend/
├── server.js                # Express app initialization
├── package.json             # Dependencies and scripts
├── config/
│   └── envVars.js          # Environment variable configuration
├── routes/
│   └── route.route.js      # Route endpoint definitions
├── controllers/
│   └── route.controller.js  # Route endpoint handler logic
├── services/
│   └── osr.service.js      # OpenRouteService API client
├── utils/
│   └── polyline.js         # Polyline encoding/decoding utilities
└── README.md               
```

## Core Modules

### Server (server.js)
- Express application setup
- CORS configuration for frontend at `http://localhost:3000`
- HTTP method support: GET, POST, PUT, DELETE
- Base API route at `/api/v1/`

### Configuration (config/envVars.js)
Manages environment variables:
- `OSR_API_KEY` - OpenRouteService API authentication key
- `PORT` - Server port (default: 8080)
- `NODE_ENV` - Environment mode

### Routes (routes/route.route.js)
Defines API endpoints:
- `POST /api/v1/route` - Calculate route between coordinates

### Controllers (controllers/route.controller.js)
**Function**: `getRouteForCar(req, res)`

Request validation:
- Checks for `coordinates` array in request body
- Validates minimum 2 coordinates (start and end point)
- Passes validated data to OSR service

### Services (services/osr.service.js)
**Function**: `fetchFromOSR(url, coordinates)`

Responsibilities:
- Makes authenticated HTTP requests to OpenRouteService API
- Endpoint: `https://api.openrouteservice.org/v2/directions/driving-car`
- Parameters:
  - `coordinates` - Array of [lng, lat] pairs
  - `alternatives` - true (enable 3 alternative routes)
  - `alternative_weights` - 1.4 (route similarity factor)
  - `requests` - Requests via OSR client library

Data Processing:
- Handles polyline-encoded geometry conversion
- Extracts route summaries (distance, duration)
- Structures response with bounding box
- Returns decoded coordinates for map visualization

### Utilities (utils/polyline.js)
Polyline encoding/decoding using `@mapbox/polyline` library:
- Converts between encoded strings and coordinate arrays
- Reduces API response payload size
- Used by OSR service for geometry handling

## OSR Service Details

### OpenRouteService Integration

The backend uses OpenRouteService for professional-grade routing:

**Features:**
- **Driving Routing** - Optimized for car travel times
- **Multiple Alternatives** - Returns 3 different route options
- **Elevation Support** - Optional elevation data
- **Polyline Compression** - Efficient geometry encoding
- **Detailed Segments** - Road-level routing details

**Request Flow:**
```
Frontend Request
    ↓
Route Controller Validation
    ↓
OSR Service API Call
    ↓
Polyline Encoding/Decoding
    ↓
Structured Response to Frontend
    ↓
Map Visualization
```

### Alternative Routes

The service requests 3 alternative routes with:
- Different road selections
- Varied route characteristics
- Weight factor: 1.4 (determines route diversity)

Frontend can display all alternatives for user comparison.

## Dependencies

```json
{
  "express": "^4.21.1",
  "@mapbox/polyline": "^0.2.1",
  "cors": "^2.8.5",
  "dotenv": "^16.0.3"
}
```

## Development

### Testing Routes

Using curl:
```bash
# Test local coordinates (London area)
curl -X POST http://localhost:8080/api/v1/route \
  -H "Content-Type: application/json" \
  -d '{
    "coordinates": [
      [-0.1182, 51.4971],
      [-0.0890, 51.5199],
      [-0.1275, 51.5073]
    ]
  }'
```

## Performance

- **Polyline Encoding** - Reduces response size by ~70% compared to full coordinate arrays
- **Async Processing** - Non-blocking route calculations
- **Caching Ready** - Can implement response caching layer
- **Connection Pooling** - Efficient HTTP client for OSR requests

## Error Handling

| Error | Status | Cause | Solution |
|-------|--------|-------|----------|
| Missing coordinates | 400 | No coordinates in request | Add `coordinates` array |
| Invalid coordinates | 400 | Array with < 2 points | Provide at least start & end |
| API Key Missing | 500 | `OSR_API_KEY` not set | Set environment variable |
| OSR Service Error | 500 | OpenRouteService unavailable | Check API status, key validity |

## License

See LICENSE file in project root.