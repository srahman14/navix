import polyline from "@mapbox/polyline";

export const decodePolyline = (routeGeometry) => {
    const coordinates = polyline.toGeoJSON(routeGeometry).coordinates;

    return coordinates;
}