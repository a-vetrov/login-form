import axios from "axios";

export const getBondsData = async () => {

  const host = 'https://iss.moex.com/iss/engines/stock/markets/bonds/boardgroups/58/securities.jsonp?iss.meta=off&iss.json=extended&lang=ru&security_collection=7&sort_column=VALTODAY&sort_order=desc'

  try {
    const result = await axios.get(host)
    return result.data[1].securities.reduce((accumulator, item) => {
      const isin = item.ISIN
      if (isin && !accumulator[isin]) {
        accumulator[isin] = item
        return accumulator
      }
    }, {})
  } catch (error) {
    console.log('Error!', error)
    return null
  }

}

export const mergeWithMOEXData = (arr, dictionary) => {
  if (!arr || !dictionary) {
    return arr
  }

  try {
    return arr.map((item) => {
      const moex = dictionary[item.isin]
      if (moex) {
        return {...item, moex}
      } else {
        return item
      }
    })
  } catch (error) {
    return arr
  }
}
