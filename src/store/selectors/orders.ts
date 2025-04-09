import { createSelector } from '@reduxjs/toolkit'
import { botsApi } from '../../services/bots'
import { type RootState } from '../index'

const ordersSelector = (id: string) => botsApi.endpoints.getBotOrders.select(id)

export const getBotOrders = (id: string) => createSelector(
  (state: RootState) => ordersSelector(id)(state),
  ({ data }) => {
    return data?.orders
  }
)
