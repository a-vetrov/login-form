export const forEachSeries = async (iterable, func) => {
  for (const x of iterable) {
    await func(x)
  }
}
