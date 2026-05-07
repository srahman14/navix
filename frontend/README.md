# Navix Frontend

A modern vehicle routing optimization interface built with **Next.js 16**, **React 19**, and **TypeScript**. Navix provides an interactive map-based UI for managing vehicles, orders, and calculating optimized delivery routes using OpenRouteService (OSR).

## Features

- **Interactive Map Visualization** - MapLibre GL-powered mapping with real-time route rendering
- **Vehicle Management** - Create, track, and manage fleet vehicles with load capacity
- **Order Management** - Add orders with priority levels and weight specifications
- **Route Optimization** - Calculate and compare multiple alternative routes (3 alternatives per query)
- **Dark Mode Support** - Light/dark theme switching with persistent preferences
- **Real-time Updates** - Live map updates using Zustand state management
- **Geolocation Support** - Start with London default or any custom coordinates
- **Responsive Design** - Beautiful UI with Radix UI components and Tailwind CSS

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend server running on `http://localhost:8080`
- OpenRouteService API key (set in `.env.local`)

### Installation

```bash
cd frontend
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_OSR_API_KEY=your_openrouteservice_api_key
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Home landing page
│   ├── layout.tsx               # Root layout with theme provider
│   ├── globals.css              # Global styles
│   └── navigation/
│       └── page.tsx             # Main routing/navigation interface
├── components/
│   ├── map.tsx                  # MapLibre GL interactive map
│   ├── AddVehicleModal.tsx       # Vehicle creation modal
│   ├── AddOrderModal.tsx         # Order creation modal
│   ├── VehiclesSection.tsx       # Vehicle list and management
│   ├── OrdersSection.tsx         # Order list and management
│   ├── RouteInfo.tsx             # Route details display (distance, duration)
│   ├── StatsGrid.tsx             # Dashboard statistics grid
│   ├── navigation-sidebar.tsx    # Main sidebar layout
│   ├── SidebarHeader.tsx         # Header with branding and controls
│   ├── theme-provider.tsx        # Next Themes provider
│   ├── theme-toggler.tsx         # Dark mode toggle button
│   └── ui/                       # Radix UI component wrappers
│       ├── button.tsx
│       └── dropdown-menu.tsx
├── lib/
│   ├── api.ts                   # Backend API client
│   └── utils.ts                 # Utility functions
├── store/
│   ├── navigation-store.ts       # Zustand state management (vehicles, orders, routes)
│   └── sidebar-store.ts          # Sidebar UI state
└── types/
    └── index.ts                 # TypeScript interfaces and types
```

## Key Components

### Map Component
- Real-time route visualization using MapLibre GL
- GeoJSON rendering for routes as LineString features
- Support for vehicle and order markers
- Interactive zoom and pan controls

### Vehicle Management
- Auto-generated vehicle IDs (TRUCK/VAN prefix)
- Load capacity tracking
- Status management (active, pending, idle)
- Geographic coordinate assignment

### Order Management  
- Auto-generated order IDs (ORD prefix)
- Priority levels (high, medium, low)
- Weight specifications
- Location coordinates

### Route Calculation
- Fetches routes from backend `/api/v1/route` endpoint
- Displays 3 alternative route options
- Shows distance and duration for each route
- Renders selected route on map

## State Management

Using **Zustand** for client-side state:
- Vehicle fleet inventory
- Order queue
- Calculated routes with alternatives
- Route selections and details
- Modal UI state
- Selected vehicle/order context

Store location: [src/store/navigation-store.ts](src/store/navigation-store.ts)

## API Integration

The frontend communicates with the backend via [src/lib/api.ts](src/lib/api.ts):

```typescript
GET  /api/v1/route
POST /api/v1/route (coordinates: [[lng, lat], ...])
```

Response includes:
- Multiple route alternatives
- Encoded and decoded geometries
- Distance and duration summaries
- Bounding boxes for map bounds

## Data Models

```typescript
interface Vehicle {
  id: string;
  status: "active" | "pending" | "idle";
  orders: number;
  load: number;
  startLocation: [number, number];
  orderId?: string;
}

interface Order {
  id: string;
  priority: "high" | "medium" | "low";
  weight: number;
  location: [number, number];
}

interface RouteInfo {
  distance: number | null;
  duration: number | null;
}
```

## Technologies

- **Next.js 16.2.3** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **MapLibre GL 5.22.0** - Vector mapping
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Radix UI** - UI component primitives
- **Framer Motion** - Animations
- **react-hot-toast** - Toast notifications
- **next-themes** - Dark mode support

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## License

See LICENSE file in project root.
