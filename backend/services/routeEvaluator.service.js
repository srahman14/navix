import { formatDistance, formatDuration } from "../utils/format.js";

export const getMetricsFromRoute = async (route) => {
    // Metrics
    // Distance, Duration
    const distance = route.summary.distance;
    const duration = route.summary.duration;
    // Elevation 
    const ascent = route.summary.ascent;
    const descent = route.summary.descent; 
    // Geometry
    // Estimated arrival time 
    const currentDate = new Date();
    const timestamp = currentDate.getTime()
    const estimatedArrivalTime = timestamp + duration; 

    return {
        distance: distance,
        duration: duration,
        ascent: ascent,
        descent: descent,
        startTime: formatDuration(timestamp),
        arrivalTime: formatDuration(estimatedArrivalTime),
    }
}