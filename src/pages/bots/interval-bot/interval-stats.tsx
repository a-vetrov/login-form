import React, { useMemo } from 'react'
import { type BotStatisticsType } from '../../../services/bots'
import { fromNumberToMoneyString } from '../../../utils/money'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import { BlueTable } from '../../../components/blue-table'
import { type SxProps } from '@mui/system'
import { type Theme } from '@mui/material'

const dict = [
  {
    key: 'executedOrdersLength',
    title: 'Исполнено ордеров',
    type: 'number'
  },
  {
    key: 'lotsBuy',
    title: 'Куплено лотов',
    type: 'number'
  },
  {
    key: 'priceBuy',
    title: 'Куплено лотов на сумму',
    type: 'money'
  },
  {
    key: 'lotsSell',
    title: 'Продано лотов',
    type: 'number'
  },
  {
    key: 'priceSell',
    title: 'Продано лотов на сумму',
    type: 'money'
  },
  {
    key: 'lots',
    title: 'Осталось нераспродано лотов',
    type: 'number'
  },
  {
    key: 'commission',
    title: 'Комиссия',
    type: 'money'
  },
  {
    key: 'serviceCommission',
    title: 'Сервисная комиссия',
    type: 'money'
  },
  {
    key: 'lastPrice',
    title: 'Последняя цена продукта',
    type: 'money'
  },
  {
    key: 'currentPrice',
    title: 'Текущая цена продукта',
    type: 'money'
  }
]

const getColorSx = (value?: number): SxProps<Theme> | null => {
  if (!value) {
    return null
  }
  return {
    color: value > 0 ? 'success.main' : 'error.light'
  }
}

interface Props {
  data: BotStatisticsType
}

export const IntervalStats: React.FC<Props> = ({ data }) => {
  const income = useMemo(() => {
    const { priceSell, priceBuy, lastPrice, currentPrice, product, lots, commission } = data
    if (priceSell === undefined || priceBuy === undefined) {
      return undefined
    }
    const sum = priceSell - priceBuy
    const result: { last: number, current?: number, unrealized?: number, unrealizedCurrent?: number, balance?: number , balanceCurrent?: number } = { last: sum }

    let priceMultiplier = 1

    if (product.type === 'future' && product.minPriceIncrement && product.minPriceIncrementAmount) {
      priceMultiplier = product.minPriceIncrementAmount / product.minPriceIncrement
    }

    if (lots && lastPrice !== undefined && product?.lot !== undefined) {
      result.unrealized = (lots * product.lot * lastPrice * priceMultiplier)
      result.last = sum + result.unrealized
      if (commission) {
        result.balance = result.last - commission
      }
    }

    if (lots && currentPrice !== undefined && product?.lot !== undefined) {
      result.unrealizedCurrent = (lots * product.lot * currentPrice * priceMultiplier)
      result.current = sum + result.unrealizedCurrent
      if (commission) {
        result.balanceCurrent = result.current - commission
      }
    }
    return result
  }, [data])

  return (
    <>
      <Table>
        <TableBody>
          {dict.map((item) => {
            const value = data[item.key as keyof BotStatisticsType] as unknown as number
            if (value !== undefined) {
              return (
                <BlueTable.Row key={item.key}>
                  <BlueTable.Cell>{item.title}</BlueTable.Cell>
                  <BlueTable.Cell align="right">{item.type === 'money' ? fromNumberToMoneyString(value, 'RUB') : value}</BlueTable.Cell>
                </BlueTable.Row>
              )
            }
            return null
          })}
          {income?.unrealized !== undefined && (
            <BlueTable.Row>
              <BlueTable.Cell>{income.current !== undefined ? 'Стоимость открытых позиций по последней цене' : 'Стоимость открытых позиций'}</BlueTable.Cell>
              <BlueTable.Cell align="right">{fromNumberToMoneyString(income.unrealized, 'RUB')}</BlueTable.Cell>
            </BlueTable.Row>
          )}
          {income?.unrealizedCurrent !== undefined && (
            <BlueTable.Row>
              <BlueTable.Cell>Стоимость открытых позиций по теккущей цене</BlueTable.Cell>
              <BlueTable.Cell align="right">{fromNumberToMoneyString(income.unrealizedCurrent, 'RUB')}</BlueTable.Cell>
            </BlueTable.Row>
          )}
          {income?.last !== undefined && (
            <BlueTable.Row>
              <BlueTable.Cell>{income.current !== undefined ? 'Прибыль по последней цене' : 'Прибыль'}</BlueTable.Cell>
              <BlueTable.Cell align="right" sx={getColorSx(income.last)}>{fromNumberToMoneyString(income.last, 'RUB')}</BlueTable.Cell>
            </BlueTable.Row>
          )}
          {income?.current !== undefined && (
            <BlueTable.Row>
              <BlueTable.Cell>{'Прибыль по текущей цене'}</BlueTable.Cell>
              <BlueTable.Cell align="right" sx={getColorSx(income.current)}>{fromNumberToMoneyString(income.current, 'RUB')}</BlueTable.Cell>
            </BlueTable.Row>
          )}
          {income?.balance !== undefined && (
            <BlueTable.Row>
              <BlueTable.Cell>{income.current !== undefined ? 'Баланс с учетом комиссии по последней цене' : 'Баланс с учетом комиссии'}</BlueTable.Cell>
              <BlueTable.Cell align="right" sx={getColorSx(income.balance)}>{fromNumberToMoneyString(income.balance, 'RUB')}</BlueTable.Cell>
            </BlueTable.Row>
          )}
          {income?.balanceCurrent !== undefined && (
            <BlueTable.Row>
              <BlueTable.Cell>{'Баланс с учетом комиссии по текущей цене'}</BlueTable.Cell>
              <BlueTable.Cell align="right" sx={getColorSx(income.balanceCurrent)}>{fromNumberToMoneyString(income.balanceCurrent, 'RUB')}</BlueTable.Cell>
            </BlueTable.Row>
          )}
        </TableBody>
      </Table>
    </>
  )
}
