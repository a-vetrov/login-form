import type {
  SecurityTradingStatus,
  Ping,
  Quotation
} from './common'

/** Тип операции со списком подписок. */
export enum SubscriptionAction {
  /** SUBSCRIPTION_ACTION_UNSPECIFIED - Статус подписки не определён. */
  SUBSCRIPTION_ACTION_UNSPECIFIED = 'SUBSCRIPTION_ACTION_UNSPECIFIED',
  /** SUBSCRIPTION_ACTION_SUBSCRIBE - Подписаться. */
  SUBSCRIPTION_ACTION_SUBSCRIBE = 'SUBSCRIPTION_ACTION_SUBSCRIBE',
  /** SUBSCRIPTION_ACTION_UNSUBSCRIBE - Отписаться. */
  SUBSCRIPTION_ACTION_UNSUBSCRIBE = 'SUBSCRIPTION_ACTION_UNSUBSCRIBE',
  UNRECOGNIZED = 'UNRECOGNIZED',
}

/** Интервал свечи. */
export enum SubscriptionInterval {
  /** SUBSCRIPTION_INTERVAL_UNSPECIFIED - Интервал свечи не определён. */
  SUBSCRIPTION_INTERVAL_UNSPECIFIED = 'SUBSCRIPTION_INTERVAL_UNSPECIFIED',
  /** SUBSCRIPTION_INTERVAL_ONE_MINUTE - Минутные свечи. */
  SUBSCRIPTION_INTERVAL_ONE_MINUTE = 'SUBSCRIPTION_INTERVAL_ONE_MINUTE',
  /** SUBSCRIPTION_INTERVAL_FIVE_MINUTES - Пятиминутные свечи. */
  SUBSCRIPTION_INTERVAL_FIVE_MINUTES = 'SUBSCRIPTION_INTERVAL_FIVE_MINUTES',
  UNRECOGNIZED = 'UNRECOGNIZED',
}

/** Результат подписки. */
export enum SubscriptionStatus {
  /** SUBSCRIPTION_STATUS_UNSPECIFIED - Статус подписки не определён. */
  SUBSCRIPTION_STATUS_UNSPECIFIED = 'SUBSCRIPTION_STATUS_UNSPECIFIED',
  /** SUBSCRIPTION_STATUS_SUCCESS - Успешно. */
  SUBSCRIPTION_STATUS_SUCCESS = 'SUBSCRIPTION_STATUS_SUCCESS',
  /** SUBSCRIPTION_STATUS_INSTRUMENT_NOT_FOUND - Инструмент не найден. */
  SUBSCRIPTION_STATUS_INSTRUMENT_NOT_FOUND = 'SUBSCRIPTION_STATUS_INSTRUMENT_NOT_FOUND',
  /** SUBSCRIPTION_STATUS_SUBSCRIPTION_ACTION_IS_INVALID - Некорректный статус подписки, список возможных значений: [SubscriptionAction](https://tinkoff.github.io/investAPI/marketdata#subscriptionaction). */
  SUBSCRIPTION_STATUS_SUBSCRIPTION_ACTION_IS_INVALID = 'SUBSCRIPTION_STATUS_SUBSCRIPTION_ACTION_IS_INVALID',
  /** SUBSCRIPTION_STATUS_DEPTH_IS_INVALID - Некорректная глубина стакана, доступные значения: 1, 10, 20, 30, 40, 50. */
  SUBSCRIPTION_STATUS_DEPTH_IS_INVALID = 'SUBSCRIPTION_STATUS_DEPTH_IS_INVALID',
  /** SUBSCRIPTION_STATUS_INTERVAL_IS_INVALID - Некорректный интервал свечей, список возможных значений: [SubscriptionInterval](https://tinkoff.github.io/investAPI/marketdata#subscriptioninterval). */
  SUBSCRIPTION_STATUS_INTERVAL_IS_INVALID = 'SUBSCRIPTION_STATUS_INTERVAL_IS_INVALID',
  /** SUBSCRIPTION_STATUS_LIMIT_IS_EXCEEDED - Превышен лимит на общее количество подписок в рамках стрима, подробнее: [Лимитная политика](https://tinkoff.github.io/investAPI/limits/). */
  SUBSCRIPTION_STATUS_LIMIT_IS_EXCEEDED = 'SUBSCRIPTION_STATUS_LIMIT_IS_EXCEEDED',
  /** SUBSCRIPTION_STATUS_INTERNAL_ERROR - Внутренняя ошибка сервиса. */
  SUBSCRIPTION_STATUS_INTERNAL_ERROR = 'SUBSCRIPTION_STATUS_INTERNAL_ERROR',
  /** SUBSCRIPTION_STATUS_TOO_MANY_REQUESTS - Превышен лимит на количество запросов на подписки в течение установленного отрезка времени */
  SUBSCRIPTION_STATUS_TOO_MANY_REQUESTS = 'SUBSCRIPTION_STATUS_TOO_MANY_REQUESTS',
  UNRECOGNIZED = 'UNRECOGNIZED',
}

/** Направление сделки. */
export enum TradeDirection {
  /** TRADE_DIRECTION_UNSPECIFIED - Направление сделки не определено. */
  TRADE_DIRECTION_UNSPECIFIED = 'TRADE_DIRECTION_UNSPECIFIED',
  /** TRADE_DIRECTION_BUY - Покупка. */
  TRADE_DIRECTION_BUY = 'TRADE_DIRECTION_BUY',
  /** TRADE_DIRECTION_SELL - Продажа. */
  TRADE_DIRECTION_SELL = 'TRADE_DIRECTION_SELL',
  UNRECOGNIZED = 'UNRECOGNIZED',
}

/** Интервал свечей. */
export enum CandleInterval {
  /** CANDLE_INTERVAL_UNSPECIFIED - Интервал не определён. */
  CANDLE_INTERVAL_UNSPECIFIED = 'CANDLE_INTERVAL_UNSPECIFIED',
  /** CANDLE_INTERVAL_1_MIN - 1 минута. */
  CANDLE_INTERVAL_1_MIN = 'CANDLE_INTERVAL_1_MIN',
  /** CANDLE_INTERVAL_5_MIN - 5 минут. */
  CANDLE_INTERVAL_5_MIN = 'CANDLE_INTERVAL_5_MIN',
  /** CANDLE_INTERVAL_15_MIN - 15 минут. */
  CANDLE_INTERVAL_15_MIN = 'CANDLE_INTERVAL_15_MIN',
  /** CANDLE_INTERVAL_HOUR - 1 час. */
  CANDLE_INTERVAL_HOUR = 'CANDLE_INTERVAL_HOUR',
  /** CANDLE_INTERVAL_DAY - 1 день. */
  CANDLE_INTERVAL_DAY = 'CANDLE_INTERVAL_DAY',
  UNRECOGNIZED = 'UNRECOGNIZED',
}

/** Запрос подписки или отписки на определённые биржевые данные. */
export interface MarketDataRequest {
  /** Запрос подписки на свечи. */
  subscribeCandlesRequest: SubscribeCandlesRequest | undefined
  /** Запрос подписки на стаканы. */
  subscribeOrderBookRequest: SubscribeOrderBookRequest | undefined
  /** Запрос подписки на ленту обезличенных сделок. */
  subscribeTradesRequest: SubscribeTradesRequest | undefined
  /** Запрос подписки на торговые статусы инструментов. */
  subscribeInfoRequest: SubscribeInfoRequest | undefined
  /** Запрос подписки на последние цены. */
  subscribeLastPriceRequest: SubscribeLastPriceRequest | undefined
}

export interface MarketDataServerSideStreamRequest {
  /** Запрос подписки на свечи. */
  subscribeCandlesRequest: SubscribeCandlesRequest | undefined
  /** Запрос подписки на стаканы. */
  subscribeOrderBookRequest: SubscribeOrderBookRequest | undefined
  /** Запрос подписки на ленту обезличенных сделок. */
  subscribeTradesRequest: SubscribeTradesRequest | undefined
  /** Запрос подписки на торговые статусы инструментов. */
  subscribeInfoRequest: SubscribeInfoRequest | undefined
  /** Запрос подписки на последние цены. */
  subscribeLastPriceRequest: SubscribeLastPriceRequest | undefined
}

/** Пакет биржевой информации по подписке. */
export interface MarketDataResponse {
  /** Результат подписки на свечи. */
  subscribeCandlesResponse: SubscribeCandlesResponse | undefined
  /** Результат подписки на стаканы. */
  subscribeOrderBookResponse: SubscribeOrderBookResponse | undefined
  /** Результат подписки на поток обезличенных сделок. */
  subscribeTradesResponse: SubscribeTradesResponse | undefined
  /** Результат подписки на торговые статусы инструментов. */
  subscribeInfoResponse: SubscribeInfoResponse | undefined
  /** Свеча. */
  candle: Candle | undefined
  /** Сделки. */
  trade: Trade | undefined
  /** Стакан. */
  orderbook: OrderBook | undefined
  /** Торговый статус. */
  tradingStatus: TradingStatus | undefined
  /** Проверка активности стрима. */
  ping: Ping | undefined
  /** Результат подписки на последние цены инструментов. */
  subscribeLastPriceResponse: SubscribeLastPriceResponse | undefined
  /** Последняя цена. */
  lastPrice: LastPrice | undefined
}

/** subscribeCandles | Изменения статуса подписки на свечи. */
export interface SubscribeCandlesRequest {
  /** Изменение статуса подписки. */
  subscriptionAction: SubscriptionAction
  /** Массив инструментов для подписки на свечи. */
  instruments: CandleInstrument[]
  /** Флаг ожидания закрытия временного интервала для отправки свечи. */
  waitingClose: boolean
}

/** Запрос изменения статус подписки на свечи. */
export interface CandleInstrument {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Интервал свечей. */
  interval: SubscriptionInterval
}

/** Результат изменения статус подписки на свечи. */
export interface SubscribeCandlesResponse {
  /** Уникальный идентификатор запроса, подробнее: [tracking_id](https://tinkoff.github.io/investAPI/grpc#tracking-id). */
  trackingId: string
  /** Массив статусов подписки на свечи. */
  candlesSubscriptions: CandleSubscription[]
}

/** Статус подписки на свечи. */
export interface CandleSubscription {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Интервал свечей. */
  interval: SubscriptionInterval
  /** Статус подписки. */
  subscriptionStatus: SubscriptionStatus
}

/** Запрос на изменение статуса подписки на стаканы. */
export interface SubscribeOrderBookRequest {
  /** Изменение статуса подписки. */
  subscriptionAction: SubscriptionAction
  /** Массив инструментов для подписки на стаканы. */
  instruments: OrderBookInstrument[]
}

/** Запрос подписки на стаканы. */
export interface OrderBookInstrument {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Глубина стакана. */
  depth: number
}

/** Результат изменения статуса подписки на стаканы. */
export interface SubscribeOrderBookResponse {
  /** Уникальный идентификатор запроса, подробнее: [tracking_id](https://tinkoff.github.io/investAPI/grpc#tracking-id). */
  trackingId: string
  /** Массив статусов подписки на стаканы. */
  orderBookSubscriptions: OrderBookSubscription[]
}

/** Статус подписки. */
export interface OrderBookSubscription {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Глубина стакана. */
  depth: number
  /** Статус подписки. */
  subscriptionStatus: SubscriptionStatus
}

/** Изменение статуса подписки на поток обезличенных сделок. */
export interface SubscribeTradesRequest {
  /** Изменение статуса подписки. */
  subscriptionAction: SubscriptionAction
  /** Массив инструментов для подписки на поток обезличенных сделок. */
  instruments: TradeInstrument[]
}

/** Запрос подписки на поток обезличенных сделок. */
export interface TradeInstrument {
  /** Figi-идентификатор инструмента. */
  figi: string
}

/** Результат изменения статуса подписки на поток обезличенных сделок. */
export interface SubscribeTradesResponse {
  /** Уникальный идентификатор запроса, подробнее: [tracking_id](https://tinkoff.github.io/investAPI/grpc#tracking-id). */
  trackingId: string
  /** Массив статусов подписки на поток сделок. */
  tradeSubscriptions: TradeSubscription[]
}

/** Статус подписки. */
export interface TradeSubscription {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Статус подписки. */
  subscriptionStatus: SubscriptionStatus
}

/** Изменение статуса подписки на торговый статус инструмента. */
export interface SubscribeInfoRequest {
  /** Изменение статуса подписки. */
  subscriptionAction: SubscriptionAction
  /** Массив инструментов для подписки на торговый статус. */
  instruments: InfoInstrument[]
}

/** Запрос подписки на торговый статус. */
export interface InfoInstrument {
  /** Figi-идентификатор инструмента. */
  figi: string
}

/** Результат изменения статуса подписки на торговый статус. */
export interface SubscribeInfoResponse {
  /** Уникальный идентификатор запроса, подробнее: [tracking_id](https://tinkoff.github.io/investAPI/grpc#tracking-id). */
  trackingId: string
  /** Массив статусов подписки на торговый статус. */
  infoSubscriptions: InfoSubscription[]
}

/** Статус подписки. */
export interface InfoSubscription {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Статус подписки. */
  subscriptionStatus: SubscriptionStatus
}

/** Изменение статуса подписки на последнюю цену инструмента. */
export interface SubscribeLastPriceRequest {
  /** Изменение статуса подписки. */
  subscriptionAction: SubscriptionAction
  /** Массив инструментов для подписки на последнюю цену. */
  instruments: LastPriceInstrument[]
}

/** Запрос подписки на последнюю цену. */
export interface LastPriceInstrument {
  /** Figi-идентификатор инструмента. */
  figi: string
}

/** Результат изменения статуса подписки на последнюю цену. */
export interface SubscribeLastPriceResponse {
  /** Уникальный идентификатор запроса, подробнее: [tracking_id](https://tinkoff.github.io/investAPI/grpc#tracking-id). */
  trackingId: string
  /** Массив статусов подписки на последнюю цену. */
  lastPriceSubscriptions: LastPriceSubscription[]
}

/** Статус подписки на последнюю цену. */
export interface LastPriceSubscription {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Статус подписки. */
  subscriptionStatus: SubscriptionStatus
}

/** Пакет свечей в рамках стрима. */
export interface Candle {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Интервал свечи. */
  interval: SubscriptionInterval
  /** Цена открытия за 1 инструмент. Для получения стоимости лота требуется умножить на лотность инструмента. */
  open: Quotation | undefined
  /** Максимальная цена за 1 инструмент. Для получения стоимости лота требуется умножить на лотность инструмента. */
  high: Quotation | undefined
  /** Минимальная цена за 1 инструмент. Для получения стоимости лота требуется умножить на лотность инструмента. */
  low: Quotation | undefined
  /** Цена закрытия за 1 инструмент. Для получения стоимости лота требуется умножить на лотность инструмента. */
  close: Quotation | undefined
  /** Объём сделок в лотах. */
  volume: number
  /** Время начала интервала свечи в часовом поясе UTC. */
  time: Date | undefined
  /** Время последней сделки, вошедшей в свечу в часовом поясе UTC. */
  lastTradeTs: Date | undefined
}

/** Пакет стаканов в рамках стрима. */
export interface OrderBook {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Глубина стакана. */
  depth: number
  /** Флаг консистентности стакана. **false** значит не все заявки попали в стакан по причинам сетевых задержек или нарушения порядка доставки. */
  isConsistent: boolean
  /** Массив предложений. */
  bids: Order[]
  /** Массив спроса. */
  asks: Order[]
  /** Время формирования стакана в часовом поясе UTC по времени биржи. */
  time: Date | undefined
  /** Верхний лимит цены за 1 инструмент. Для получения стоимости лота требуется умножить на лотность инструмента. */
  limitUp: Quotation | undefined
  /** Нижний лимит цены за 1 инструмент. Для получения стоимости лота требуется умножить на лотность инструмента. */
  limitDown: Quotation | undefined
}

/** Массив предложений/спроса. */
export interface Order {
  /** Цена за 1 инструмент. Для получения стоимости лота требуется умножить на лотность инструмента. */
  price: Quotation | undefined
  /** Количество в лотах. */
  quantity: number
}

/** Информация о сделке. */
export interface Trade {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Направление сделки. */
  direction: TradeDirection
  /** Цена за 1 инструмент. Для получения стоимости лота требуется умножить на лотность инструмента. */
  price: Quotation | undefined
  /** Количество лотов. */
  quantity: number
  /** Время сделки в часовом поясе UTC по времени биржи. */
  time: Date | undefined
}

/** Пакет изменения торгового статуса. */
export interface TradingStatus {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Статус торговли инструментом. */
  tradingStatus: SecurityTradingStatus
  /** Время изменения торгового статуса в часовом поясе UTC. */
  time: Date | undefined
  /** Признак доступности выставления лимитной заявки по инструменту. */
  limitOrderAvailableFlag: boolean
  /** Признак доступности выставления рыночной заявки по инструменту. */
  marketOrderAvailableFlag: boolean
}

/** Запрос исторических свечей. */
export interface GetCandlesRequest {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Начало запрашиваемого периода в часовом поясе UTC. */
  from: Date | undefined
  /** Окончание запрашиваемого периода в часовом поясе UTC. */
  to: Date | undefined
  /** Интервал запрошенных свечей. */
  interval: CandleInterval
}

/** Список свечей. */
export interface GetCandlesResponse {
  /** Массив свечей. */
  candles: HistoricCandle[]
}

/** Информация о свече. */
export interface HistoricCandle {
  /** Цена открытия за 1 инструмент. Для получения стоимости лота требуется умножить на лотность инструмента. */
  open: Quotation | undefined
  /** Максимальная цена за 1 инструмент. Для получения стоимости лота требуется умножить на лотность инструмента. */
  high: Quotation | undefined
  /** Минимальная цена за 1 инструмент. Для получения стоимости лота требуется умножить на лотность инструмента. */
  low: Quotation | undefined
  /** Цена закрытия за 1 инструмент. Для получения стоимости лота требуется умножить на лотность инструмента. */
  close: Quotation | undefined
  /** Объём торгов в лотах. */
  volume: number
  /** Время свечи в часовом поясе UTC. */
  time: Date | undefined
  /** Признак завершённости свечи. **false** значит, свеча за текущие интервал ещё сформирована не полностью. */
  isComplete: boolean
}

/** Запрос получения последних цен. */
export interface GetLastPricesRequest {
  /** Массив figi-идентификаторов инструментов. */
  figi: string[]
}

/** Список последних цен. */
export interface GetLastPricesResponse {
  /** Массив последних цен. */
  lastPrices: LastPrice[]
}

/** Информация о цене. */
export interface LastPrice {
  /** Идентификатор инструмента. */
  figi: string
  /** Последняя цена за 1 инструмент. Для получения стоимости лота требуется умножить на лотность инструмента. */
  price: Quotation | undefined
  /** Время получения последней цены в часовом поясе UTC по времени биржи. */
  time: Date | undefined
}

/** Запрос стакана. */
export interface GetOrderBookRequest {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Глубина стакана. */
  depth: number
}

/** Информация о стакане. */
export interface GetOrderBookResponse {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Глубина стакана. */
  depth: number
  /** Множество пар значений на покупку. */
  bids: Order[]
  /** Множество пар значений на продажу. */
  asks: Order[]
  /** Цена последней сделки за 1 инструмент. Для получения стоимости лота требуется умножить на лотность инструмента. */
  lastPrice: Quotation | undefined
  /** Цена закрытия за 1 инструмент. Для получения стоимости лота требуется умножить на лотность инструмента. */
  closePrice: Quotation | undefined
  /** Верхний лимит цены за 1 инструмент. Для получения стоимости лота требуется умножить на лотность инструмента. */
  limitUp: Quotation | undefined
  /** Нижний лимит цены за 1 инструмент. Для получения стоимости лота требуется умножить на лотность инструмента. */
  limitDown: Quotation | undefined
}

/** Запрос получения торгового статуса. */
export interface GetTradingStatusRequest {
  /** Идентификатор инструмента. */
  figi: string
}

/** Информация о торговом статусе. */
export interface GetTradingStatusResponse {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Статус торговли инструментом. */
  tradingStatus: SecurityTradingStatus
  /** Признак доступности выставления лимитной заявки по инструменту. */
  limitOrderAvailableFlag: boolean
  /** Признак доступности выставления рыночной заявки по инструменту. */
  marketOrderAvailableFlag: boolean
  /** Признак доступности торгов через API. */
  apiTradeAvailableFlag: boolean
}

/** Запрос последних обезличенных сделок по инструменту. */
export interface GetLastTradesRequest {
  /** Figi-идентификатор инструмента */
  figi: string
  /** Начало запрашиваемого периода в часовом поясе UTC. */
  from: Date | undefined
  /** Окончание запрашиваемого периода в часовом поясе UTC. */
  to: Date | undefined
}

/** Последние обезличенные сделки по инструменту. */
export interface GetLastTradesResponse {
  /** Массив сделок */
  trades: Trade[]
}

/** Сервис получения биржевой информации:</br> **1**. свечи;</br> **2**. стаканы;</br> **3**. торговые статусы;</br> **4**. лента сделок. */
export interface MarketDataService {
  /** Метод запроса исторических свечей по инструменту. */
  GetCandles: (request: GetCandlesRequest) => Promise<GetCandlesResponse>
  /** Метод запроса последних цен по инструментам. */
  GetLastPrices: (request: GetLastPricesRequest) => Promise<GetLastPricesResponse>
  /** Метод получения стакана по инструменту. */
  GetOrderBook: (request: GetOrderBookRequest) => Promise<GetOrderBookResponse>
  /** Метод запроса статуса торгов по инструментам. */
  GetTradingStatus: (
    request: GetTradingStatusRequest
  ) => Promise<GetTradingStatusResponse>
  /** Метод запроса последних обезличенных сделок по инструменту. */
  GetLastTrades: (request: GetLastTradesRequest) => Promise<GetLastTradesResponse>
}


