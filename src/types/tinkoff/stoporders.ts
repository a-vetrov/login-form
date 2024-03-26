import type { Quotation, MoneyValue } from './common'

/** Направление сделки стоп-заявки. */
export enum StopOrderDirection {
  /** STOP_ORDER_DIRECTION_UNSPECIFIED - Значение не указано. */
  STOP_ORDER_DIRECTION_UNSPECIFIED = 'STOP_ORDER_DIRECTION_UNSPECIFIED',
  /** STOP_ORDER_DIRECTION_BUY - Покупка. */
  STOP_ORDER_DIRECTION_BUY = 'STOP_ORDER_DIRECTION_BUY',
  /** STOP_ORDER_DIRECTION_SELL - Продажа. */
  STOP_ORDER_DIRECTION_SELL = 'STOP_ORDER_DIRECTION_SELL',
  UNRECOGNIZED = 'UNRECOGNIZED',
}

/** Тип экспирации стоп-заявке. */
export enum StopOrderExpirationType {
  /** STOP_ORDER_EXPIRATION_TYPE_UNSPECIFIED - Значение не указано. */
  STOP_ORDER_EXPIRATION_TYPE_UNSPECIFIED = 'STOP_ORDER_EXPIRATION_TYPE_UNSPECIFIED',
  /** STOP_ORDER_EXPIRATION_TYPE_GOOD_TILL_CANCEL - Действительно до отмены. */
  STOP_ORDER_EXPIRATION_TYPE_GOOD_TILL_CANCEL = 'STOP_ORDER_EXPIRATION_TYPE_GOOD_TILL_CANCEL',
  /** STOP_ORDER_EXPIRATION_TYPE_GOOD_TILL_DATE - Действительно до даты снятия. */
  STOP_ORDER_EXPIRATION_TYPE_GOOD_TILL_DATE = 'STOP_ORDER_EXPIRATION_TYPE_GOOD_TILL_DATE',
  UNRECOGNIZED = 'UNRECOGNIZED',
}

/** Тип стоп-заявки. */
export enum StopOrderType {
  /** STOP_ORDER_TYPE_UNSPECIFIED - Значение не указано. */
  STOP_ORDER_TYPE_UNSPECIFIED = 'STOP_ORDER_TYPE_UNSPECIFIED',
  /** STOP_ORDER_TYPE_TAKE_PROFIT - Take-profit заявка. */
  STOP_ORDER_TYPE_TAKE_PROFIT = 'STOP_ORDER_TYPE_TAKE_PROFIT',
  /** STOP_ORDER_TYPE_STOP_LOSS - Stop-loss заявка. */
  STOP_ORDER_TYPE_STOP_LOSS = 'STOP_ORDER_TYPE_STOP_LOSS',
  /** STOP_ORDER_TYPE_STOP_LIMIT - Stop-limit заявка. */
  STOP_ORDER_TYPE_STOP_LIMIT = 'STOP_ORDER_TYPE_STOP_LIMIT',
  UNRECOGNIZED = 'UNRECOGNIZED',
}

/** Запрос выставления стоп-заявки. */
export interface PostStopOrderRequest {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Количество лотов. */
  quantity: number
  /** Цена за 1 инструмент. Для получения стоимости лота требуется умножить на лотность инструмента. */
  price: Quotation | undefined
  /** Стоп-цена заявки за 1 инструмент. Для получения стоимости лота требуется умножить на лотность инструмента. */
  stopPrice: Quotation | undefined
  /** Направление операции. */
  direction: StopOrderDirection
  /** Номер счёта. */
  accountId: string
  /** Тип экспирации заявки. */
  expirationType: StopOrderExpirationType
  /** Тип заявки. */
  stopOrderType: StopOrderType
  /** Дата и время окончания действия стоп-заявки в часовом поясе UTC. **Для ExpirationType = GoodTillDate заполнение обязательно**. */
  expireDate: Date | undefined
}

/** Результат выставления стоп-заявки. */
export interface PostStopOrderResponse {
  /** Уникальный идентификатор стоп-заявки. */
  stopOrderId: string
}

/** Запрос получения списка активных стоп-заявок. */
export interface GetStopOrdersRequest {
  /** Идентификатор счёта клиента. */
  accountId: string
}

/** Список активных стоп-заявок. */
export interface GetStopOrdersResponse {
  /** Массив стоп-заявок по счёту. */
  stopOrders: StopOrder[]
}

/** Запрос отмены выставленной стоп-заявки. */
export interface CancelStopOrderRequest {
  /** Идентификатор счёта клиента. */
  accountId: string
  /** Уникальный идентификатор стоп-заявки. */
  stopOrderId: string
}

/** Результат отмены выставленной стоп-заявки. */
export interface CancelStopOrderResponse {
  /** Время отмены заявки в часовом поясе UTC. */
  time: Date | undefined
}

/** Информация о стоп-заявке. */
export interface StopOrder {
  /** Идентификатор-идентификатор стоп-заявки. */
  stopOrderId: string
  /** Запрошено лотов. */
  lotsRequested: number
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Направление операции. */
  direction: StopOrderDirection
  /** Валюта стоп-заявки. */
  currency: string
  /** Тип стоп-заявки. */
  orderType: StopOrderType
  /** Дата и время выставления заявки в часовом поясе UTC. */
  createDate: Date | undefined
  /** Дата и время конвертации стоп-заявки в биржевую в часовом поясе UTC. */
  activationDateTime: Date | undefined
  /** Дата и время снятия заявки в часовом поясе UTC. */
  expirationTime: Date | undefined
  /** Цена заявки за 1 инструмент. Для получения стоимости лота требуется умножить на лотность инструмента. */
  price: MoneyValue | undefined
  /** Цена активации стоп-заявки за 1 инструмент. Для получения стоимости лота требуется умножить на лотность инструмента. */
  stopPrice: MoneyValue | undefined
}

/**
 * Сервис предназначен для работы со стоп-заявками:</br> **1**.
 * выставление;</br> **2**. отмена;</br> **3**. получение списка стоп-заявок.
 */
export interface StopOrdersService {
  /** Метод выставления стоп-заявки. */
  PostStopOrder: (request: PostStopOrderRequest) => Promise<PostStopOrderResponse>
  /** Метод получения списка активных стоп заявок по счёту. */
  GetStopOrders: (request: GetStopOrdersRequest) => Promise<GetStopOrdersResponse>
  /** Метод отмены стоп-заявки. */
  CancelStopOrder: (
    request: CancelStopOrderRequest
  ) => Promise<CancelStopOrderResponse>
}
