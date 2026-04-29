import polyline from "@mapbox/polyline";

export const convertPolylineToCoordinates = (routeGeometry) => {
    const coordinates = polyline.toGeoJSON(routeGeometry).coordinates;

    return coordinates;
}