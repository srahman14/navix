import { RouteInfo } from "@/types";

export const formatDistance = (distance: number | null) => {
    if (distance === null) return "-";
    return `${(distance / 1000).toFixed(2)} km`;
  };

export const formatDuration = (duration: number | null) => {
    if (duration === null) return "-";
    const minutes = Math.floor(duration / 60);
    return `${minutes} min`;
  };

export function copyRouteInfo(vehicleId: string | undefined, orderId: string | undefined, routeStartLocation: string, routeEndLocation: string, routeInfo: RouteInfo[] | null) {
  if (!routeInfo) return;
  
  const routesText = routeInfo
    .map((route, index) => {
      return `Route ${index + 1}:
      Distance: ${formatDistance(route.distance)}
      Duration: ${formatDuration(route.duration)}`
    })
    .join('\n\n')

  return `Route Information for vehicle: ${vehicleId} with corresponding ${orderId}. 
Route starting location: ${routeStartLocation}
Route ending location: ${routeEndLocation}
  
All routes obtained:

${routesText}
  `
}