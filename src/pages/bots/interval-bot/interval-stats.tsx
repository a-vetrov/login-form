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
    const { priceSell, priceBuy, lastPrice, currentPrice, product, lots } = data
    if (priceSell === undefined || priceBuy === undefined) {
      return undefined
    }
    const sum = priceSell - priceBuy
    const result: { last: number, current?: number } = { last: sum }

    if (lots && lastPrice !== undefined && product?.lot !== undefined) {
      result.last = sum + (lots * product.lot * lastPrice)
    }

    if (lots && currentPrice !== undefined && product?.lot !== undefined) {
      result.current = sum + (lots * product.lot * currentPrice)
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
          {income?.last !== undefined && (
            <BlueTable.Row>
              <BlueTable.Cell>{income.current !== undefined ? 'Прибыль по последней цене' : 'Прибыль'}</BlueTable.Cell>
              <BlueTable.Cell align="right" sx={getColorSx(income.last)}>{fromNumberToMoneyString(income.last, 'RUB')}</BlueTable.Cell>
            </BlueTable.Row>
          )}
          {income?.current !== undefined && (
            <BlueTable.Row>
              <BlueTable.Cell>{'Прибыль по текущей цене'}</BlueTable.Cell>
              <BlueTable.Cell align="right" sx={getColorSx(income.last)}>{fromNumberToMoneyString(income.current, 'RUB')}</BlueTable.Cell>
            </BlueTable.Row>
          )}
        </TableBody>
      </Table>
    </>
  )
}
