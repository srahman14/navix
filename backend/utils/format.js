export const formatDistance = (distance) => {
    if (distance === null) return "-";
    return `${(distance / 1000).toFixed(2)} km`;
  };

export const formatDuration = (duration) => {
    if (duration === null) return "-";
    const minutes = Math.floor(duration / 60);
    return `${minutes} min`;
  };