import { type Time } from 'lightweight-charts'

interface ICandle {
  time: Time
}

const sortFn = (a: ICandle, b: ICandle): number => a.time - b.time

export const mergeCandles = (arr1: ICandle[], arr2: ICandle[]): ICandle[] => {
  let sorted: ICandle[] = []
  let indexA = 0
  let indexB = 0

  while (indexA < arr1.length && indexB < arr2.length) {
    const compare = sortFn(arr1[indexA], arr2[indexB])
    if (compare > 0) {
      sorted.push(arr2[indexB])
      indexB++
    } else if (compare < 0) {
      sorted.push(arr1[indexA])
      indexA++
    } else {
      sorted.push(arr2[indexB])
      indexB++
      indexA++
    }
  }

  if (indexB < arr2.length) {
    sorted = sorted.concat(arr2.slice(indexB))
  } else {
    sorted = sorted.concat(arr1.slice(indexA))
  }

  return sorted
}
