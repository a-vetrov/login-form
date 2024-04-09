import { dotDelimiter } from '../../constants'
import {format} from 'date-fns';
import {toMoneyString} from '../../utils/money';
import type {MoneyValue} from '../../types/tinkoff/common';

export const getIds = (data?: Record<string, string>): string | null => {
  if (!data) {
    return null
  }
  const result = []

  if (data.isin) {
    result.push(data.isin)
  }
  if (data.ticker) {
    result.push(data.ticker)
  }
  if (data.figi) {
    result.push(data.figi)
  }

  return result.join(dotDelimiter)
}

const shareTypes = [
  'Значение не определено',
  'Обыкновенная акция',
  'Привилегированная акция',
  'Американские депозитарные расписки',
  'Глобальные депозитарные расписки',
  'Товарищество с ограниченной ответственностью',
  'Акции из реестра Нью-Йорка',
  'Закрытый инвестиционный фонд',
  'Траст недвижимости'
]

const realExchange = [
  'Тип не определён',
  'Московская биржа',
  'Санкт-Петербургская биржа',
  'Внебиржевой инструмент'
]

const convertDate = (dateString: string): string => {
  const date = new Date(dateString)
  return format(date, 'dd.MM.yyyy')
}

export interface KeyValueType {
  key: string
  value: string
}

export const getMainProperties = (data?: Record<string, unknown>): KeyValueType[] => {
  const result = [] as KeyValueType[]

  if (!data) {
    return result
  }

  if (data.shareType) {
    result.push({
      key: 'Тип',
      value: shareTypes[data.shareType as number]
    })
  }

  if (data.currency) {
    result.push({
      key: 'Валюта',
      value: data.currency as string
    })
  }
  if (data.realExchange) {
    result.push({
      key: 'Биржа',
      value: realExchange[data.realExchange as number]
    })
  }

  if (data.lot) {
    result.push({
      key: 'Лотность',
      value: (data.lot as number).toLocaleString('ru-RU')
    })
  }

  if (data.countryOfRiskName) {
    result.push({
      key: 'Страна',
      value: data.countryOfRiskName as string
    })
  }

  if (data.sector) {
    result.push({
      key: 'Сектор экономики',
      value: data.sector as string
    })
  }

  if (data.couponQuantityPerYear) {
    result.push({
      key: 'Количество купонов в год',
      value: data.couponQuantityPerYear as string
    })
  }

  if (data.riskLevel) {
    result.push({
      key: 'Риск',
      value: data.riskLevel as string
    })
  }

  if (data.nominal) {
    result.push({
      key: 'Номинал',
      value: toMoneyString(data.nominal as MoneyValue)
    })
  }

  if (data.aciValue) {
    result.push({
      key: 'НКД',
      value: toMoneyString(data.aciValue as MoneyValue)
    })
  }

  if (data.maturityDate) {
    result.push({
      key: 'Дата погашения',
      value: convertDate(data.maturityDate as string)
    })
  }

  return result
}
