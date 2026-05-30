export const formatDistance = (distance: number | null) => {
    if (distance === null) return "-";
    return `${(distance / 1000).toFixed(2)} km`;
  };

export const formatDuration = (duration: number | null) => {
    if (duration === null) return "-";
    const minutes = Math.floor(duration / 60);
    return `${minutes} min`;
  };