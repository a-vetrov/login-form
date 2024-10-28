export const getMinMax = (min: number, max: number): { min: number, max: number } => {
  if (max > min) {
    return {
      min,
      max
    }
  }
  return {
    min: max,
    max: min
  }
}
