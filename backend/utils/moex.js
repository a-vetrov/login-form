import axios from 'axios'

const getMOEXData = async (host) => {
  try {
    const result = await axios.get(host)
    const { marketdata, securities, marketdata_yields } = result.data[1]
    marketdata.forEach((item, index) => {
      item.ISIN = securities[index]?.ISIN || securities[index]?.SECID
      item.EFFECTIVEYIELDWAPRICE = marketdata_yields[index]?.EFFECTIVEYIELDWAPRICE
    })
    return marketdata.reduce((accumulator, item) => {
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

export const getBondsData = async () => {
  const host = 'https://iss.moex.com/iss/engines/stock/markets/bonds/boardgroups/58/securities.jsonp?iss.meta=off&iss.json=extended&lang=ru&security_collection=7&sort_column=VALTODAY&sort_order=desc'

  return await getMOEXData(host)
}

export const getStocksData = async () => {
  const host = 'https://iss.moex.com/iss/engines/stock/markets/shares/boardgroups/57/securities.jsonp?iss.meta=off&iss.json=extended&&lang=ru&security_collection=3&sort_column=VALTODAY&sort_order=desc'

  return await getMOEXData(host)
}

export const getCurrencyData = async () => {
  const host = 'https://iss.moex.com/iss/engines/currency/markets/selt/boardgroups/13/securities.jsonp?iss.meta=off&iss.json=extended&lang=ru&security_collection=177&sort_column=VALTODAY&sort_order=desc'

  return await getMOEXData(host)
}

export const mergeWithMOEXData = (arr, dictionary) => {
  if (!arr || !dictionary) {
    return arr
  }

  try {
    return arr.map((item) => {
      const moex = dictionary[item.isin || item.ticker]
      if (moex) {
        return { ...item, moex }
      } else {
        return item
      }
    })
  } catch (error) {
    return arr
  }
}
