import React, { useEffect, useMemo } from 'react'
import {
  useGetBotStatisticsQuery,
  useLazyGetBotOrdersQuery
} from '../../../services/bots'
import { Typography } from '@mui/material'
import { IntervalStats } from './interval-stats'
import { BotOrders } from '../orders/bot-orders'
import { getLotPrice } from './utils'

interface Props {
  id: string
  active?: boolean
}

export const IntervalDetails: React.FC<Props> = ({ id, active }) => {
  const [getOrders, { data: ordersData }] = useLazyGetBotOrdersQuery()

  const { data: statData, error: statError } = useGetBotStatisticsQuery(id, {
    pollingInterval: active ? 5000 : undefined,
    skipPollingIfUnfocused: true
  })

  const lotPrice = useMemo(() => {
    console.log('statData', statData)
    if (!statData) {
      return undefined
    }

    return getLotPrice(statData.product, statData.currentPrice ?? statData.lastPrice)
  }, [statData])

  useEffect(() => {
    if (statData) {
      void getOrders(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statData?.executedOrdersLength, getOrders, id])

  return (
    <>
      {statData && (
        <>
          <Typography variant="h2" marginBottom={2} marginTop={4}>
            Сводка по боту
          </Typography>
          <IntervalStats data={statData} />
        </>
      )}
      {ordersData && <BotOrders data={ordersData} lotPrice={lotPrice}/> }

    </>
  )
}
