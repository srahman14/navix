export const euclideanDistance = (
  a: [number, number] | undefined,
  b: [number, number] | undefined
) => {
    if (a && b) {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        return Math.sqrt(dx * dx + dy * dy);
    }
    return null;
};