import type {
  SecurityTradingStatus,
  MoneyValue,
  Quotation
} from './common'

/** Тип купонов. */
export enum CouponType {
  /** COUPON_TYPE_UNSPECIFIED - Неопределенное значение */
  COUPON_TYPE_UNSPECIFIED = 'COUPON_TYPE_UNSPECIFIED',
  /** COUPON_TYPE_CONSTANT - Постоянный */
  COUPON_TYPE_CONSTANT = 'COUPON_TYPE_CONSTANT',
  /** COUPON_TYPE_FLOATING - Плавающий */
  COUPON_TYPE_FLOATING = 'COUPON_TYPE_FLOATING',
  /** COUPON_TYPE_DISCOUNT - Дисконт */
  COUPON_TYPE_DISCOUNT = 'COUPON_TYPE_DISCOUNT',
  /** COUPON_TYPE_MORTGAGE - Ипотечный */
  COUPON_TYPE_MORTGAGE = 'COUPON_TYPE_MORTGAGE',
  /** COUPON_TYPE_FIX - Фиксированный */
  COUPON_TYPE_FIX = 'COUPON_TYPE_FIX',
  /** COUPON_TYPE_VARIABLE - Переменный */
  COUPON_TYPE_VARIABLE = 'COUPON_TYPE_VARIABLE',
  /** COUPON_TYPE_OTHER - Прочее */
  COUPON_TYPE_OTHER = 'COUPON_TYPE_OTHER',
  UNRECOGNIZED = 'UNRECOGNIZED',
}

/** Тип идентификатора инструмента. Подробнее об идентификации инструментов: [Идентификация инструментов](https://tinkoff.github.io/investAPI/faq_identification/) */
export enum InstrumentIdType {
  /** INSTRUMENT_ID_UNSPECIFIED - Значение не определено. */
  INSTRUMENT_ID_UNSPECIFIED = 'INSTRUMENT_ID_UNSPECIFIED',
  /** INSTRUMENT_ID_TYPE_FIGI - Figi. */
  INSTRUMENT_ID_TYPE_FIGI = 'INSTRUMENT_ID_TYPE_FIGI',
  /** INSTRUMENT_ID_TYPE_TICKER - Ticker. */
  INSTRUMENT_ID_TYPE_TICKER = 'INSTRUMENT_ID_TYPE_TICKER',
  /** INSTRUMENT_ID_TYPE_UID - Уникальный идентификатор. */
  INSTRUMENT_ID_TYPE_UID = 'INSTRUMENT_ID_TYPE_UID',
  UNRECOGNIZED = 'UNRECOGNIZED',
}

/** Статус запрашиваемых инструментов. */
export enum InstrumentStatus {
  /** INSTRUMENT_STATUS_UNSPECIFIED - Значение не определено. */
  INSTRUMENT_STATUS_UNSPECIFIED = 'INSTRUMENT_STATUS_UNSPECIFIED',
  /** INSTRUMENT_STATUS_BASE - Базовый список инструментов (по умолчанию). Инструменты доступные для торговли через TINKOFF INVEST API. */
  INSTRUMENT_STATUS_BASE = 'INSTRUMENT_STATUS_BASE',
  /** INSTRUMENT_STATUS_ALL - Список всех инструментов. */
  INSTRUMENT_STATUS_ALL = 'INSTRUMENT_STATUS_ALL',
  UNRECOGNIZED = 'UNRECOGNIZED',
}

/** Тип акций. */
export enum ShareType {
  /** SHARE_TYPE_UNSPECIFIED - Значение не определено. */
  SHARE_TYPE_UNSPECIFIED = 'SHARE_TYPE_UNSPECIFIED',
  /** SHARE_TYPE_COMMON - Обыкновенная */
  SHARE_TYPE_COMMON = 'SHARE_TYPE_COMMON',
  /** SHARE_TYPE_PREFERRED - Привилегированная */
  SHARE_TYPE_PREFERRED = 'SHARE_TYPE_PREFERRED',
  /** SHARE_TYPE_ADR - Американские депозитарные расписки */
  SHARE_TYPE_ADR = 'SHARE_TYPE_ADR',
  /** SHARE_TYPE_GDR - Глобальные депозитарные расписки */
  SHARE_TYPE_GDR = 'SHARE_TYPE_GDR',
  /** SHARE_TYPE_MLP - Товарищество с ограниченной ответственностью */
  SHARE_TYPE_MLP = 'SHARE_TYPE_MLP',
  /** SHARE_TYPE_NY_REG_SHRS - Акции из реестра Нью-Йорка */
  SHARE_TYPE_NY_REG_SHRS = 'SHARE_TYPE_NY_REG_SHRS',
  /** SHARE_TYPE_CLOSED_END_FUND - Закрытый инвестиционный фонд */
  SHARE_TYPE_CLOSED_END_FUND = 'SHARE_TYPE_CLOSED_END_FUND',
  /** SHARE_TYPE_REIT - Траст недвижимости */
  SHARE_TYPE_REIT = 'SHARE_TYPE_REIT',
  UNRECOGNIZED = 'UNRECOGNIZED',
}

/** Тип актива. */
export enum AssetType {
  /** ASSET_TYPE_UNSPECIFIED - Тип не определён. */
  ASSET_TYPE_UNSPECIFIED = 'ASSET_TYPE_UNSPECIFIED',
  /** ASSET_TYPE_CURRENCY - Валюта. */
  ASSET_TYPE_CURRENCY = 'ASSET_TYPE_CURRENCY',
  /** ASSET_TYPE_COMMODITY - Товар. */
  ASSET_TYPE_COMMODITY = 'ASSET_TYPE_COMMODITY',
  /** ASSET_TYPE_INDEX - Индекс. */
  ASSET_TYPE_INDEX = 'ASSET_TYPE_INDEX',
  /** ASSET_TYPE_SECURITY - Ценная бумага. */
  ASSET_TYPE_SECURITY = 'ASSET_TYPE_SECURITY',
  UNRECOGNIZED = 'UNRECOGNIZED',
}

/** Тип структурной ноты. */
export enum StructuredProductType {
  /** SP_TYPE_UNSPECIFIED - Тип не определён. */
  SP_TYPE_UNSPECIFIED = 'SP_TYPE_UNSPECIFIED',
  /** SP_TYPE_DELIVERABLE - Поставочный. */
  SP_TYPE_DELIVERABLE = 'SP_TYPE_DELIVERABLE',
  /** SP_TYPE_NON_DELIVERABLE - Беспоставочный. */
  SP_TYPE_NON_DELIVERABLE = 'SP_TYPE_NON_DELIVERABLE',
  UNRECOGNIZED = 'UNRECOGNIZED',
}

/** Тип действия со списком избранных инструментов. */
export enum EditFavoritesActionType {
  /** EDIT_FAVORITES_ACTION_TYPE_UNSPECIFIED - Тип не определён. */
  EDIT_FAVORITES_ACTION_TYPE_UNSPECIFIED = 'EDIT_FAVORITES_ACTION_TYPE_UNSPECIFIED',
  /** EDIT_FAVORITES_ACTION_TYPE_ADD - Добавить в список. */
  EDIT_FAVORITES_ACTION_TYPE_ADD = 'EDIT_FAVORITES_ACTION_TYPE_ADD',
  /** EDIT_FAVORITES_ACTION_TYPE_DEL - Удалить из списка. */
  EDIT_FAVORITES_ACTION_TYPE_DEL = 'EDIT_FAVORITES_ACTION_TYPE_DEL',
  UNRECOGNIZED = 'UNRECOGNIZED',
}

/** Реальная площадка исполнения расчётов. */
export enum RealExchange {
  /** REAL_EXCHANGE_UNSPECIFIED - Тип не определён. */
  REAL_EXCHANGE_UNSPECIFIED = 'REAL_EXCHANGE_UNSPECIFIED',
  /** REAL_EXCHANGE_MOEX - Московская биржа. */
  REAL_EXCHANGE_MOEX = 'REAL_EXCHANGE_MOEX',
  /** REAL_EXCHANGE_RTS - Санкт-Петербургская биржа. */
  REAL_EXCHANGE_RTS = 'REAL_EXCHANGE_RTS',
  /** REAL_EXCHANGE_OTC - Внебиржевой инструмент. */
  REAL_EXCHANGE_OTC = 'REAL_EXCHANGE_OTC',
  UNRECOGNIZED = 'UNRECOGNIZED',
}

/** Запрос расписания торгов */
export interface TradingSchedulesRequest {
  /** Наименование биржи или расчетного календаря. </br>Если не передаётся, возвращается информация по всем доступным торговым площадкам. */
  exchange: string
  /** Начало периода по часовому поясу UTC. */
  from: Date | undefined
  /** Окончание периода по часовому поясу UTC. */
  to: Date | undefined
}

/** Список торговых площадок */
export interface TradingSchedulesResponse {
  /** Список торговых площадок и режимов торгов. */
  exchanges: TradingSchedule[]
}

/** Данные по торговой площадке. */
export interface TradingSchedule {
  /** Наименование торговой площадки. */
  exchange: string
  /** Массив с торговыми и неторговыми днями. */
  days: TradingDay[]
}

/** Информация о времени торгов. */
export interface TradingDay {
  /** Дата. */
  date: Date | undefined
  /** Признак торгового дня на бирже. */
  isTradingDay: boolean
  /** Время начала торгов по часовому поясу UTC. */
  startTime: Date | undefined
  /** Время окончания торгов по часовому поясу UTC. */
  endTime: Date | undefined
  /** Время начала аукциона открытия в часовом поясе UTC. */
  openingAuctionStartTime: Date | undefined
  /** Время окончания аукциона закрытия в часовом поясе UTC. */
  closingAuctionEndTime: Date | undefined
  /** Время начала аукциона открытия вечерней сессии в часовом поясе UTC. */
  eveningOpeningAuctionStartTime: Date | undefined
  /** Время начала вечерней сессии в часовом поясе UTC. */
  eveningStartTime: Date | undefined
  /** Время окончания вечерней сессии в часовом поясе UTC. */
  eveningEndTime: Date | undefined
  /** Время начала основного клиринга в часовом поясе UTC. */
  clearingStartTime: Date | undefined
  /** Время окончания основного клиринга в часовом поясе UTC. */
  clearingEndTime: Date | undefined
  /** Время начала премаркета в часовом поясе UTC. */
  premarketStartTime: Date | undefined
  /** Время окончания премаркета в часовом поясе UTC. */
  premarketEndTime: Date | undefined
}

/** Запрос получения инструмента по идентификатору. */
export interface InstrumentRequest {
  /** Тип идентификатора инструмента. Возможные значения: figi, ticker. Подробнее об идентификации инструментов: [Идентификация инструментов](https://tinkoff.github.io/investAPI/faq_identification/) */
  idType: InstrumentIdType
  /** Идентификатор class_code. Обязателен при id_type = ticker. */
  classCode: string
  /** Идентификатор запрашиваемого инструмента. */
  id: string
}

/** Запрос получения инструментов. */
export interface InstrumentsRequest {
  /** Статус запрашиваемых инструментов. Возможные значения: [InstrumentStatus](#instrumentstatus) */
  instrumentStatus: InstrumentStatus
}

/** Информация об облигации. */
export interface BondResponse {
  /** Информация об облигации. */
  instrument: Bond | undefined
}

/** Список облигаций. */
export interface BondsResponse {
  /** Массив облигаций. */
  instruments: Bond[]
}

/** Запрос купонов по облигации. */
export interface GetBondCouponsRequest {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Начало запрашиваемого периода в часовом поясе UTC. Фильтрация по coupon_date (дата выплаты купона) */
  from: Date | undefined
  /** Окончание запрашиваемого периода в часовом поясе UTC. Фильтрация по coupon_date (дата выплаты купона) */
  to: Date | undefined
}

/** Купоны по облигации. */
export interface GetBondCouponsResponse {
  events: Coupon[]
}

/** Объект передачи информации о купоне облигации. */
export interface Coupon {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Дата выплаты купона */
  couponDate: Date | undefined
  /** Номер купона */
  couponNumber: number
  /** (Опционально) Дата фиксации реестра для выплаты купона */
  fixDate: Date | undefined
  /** Выплата на одну облигацию */
  payOneBond: MoneyValue | undefined
  /** Тип купона */
  couponType: CouponType
  /** Начало купонного периода. */
  couponStartDate: Date | undefined
  /** Окончание купонного периода. */
  couponEndDate: Date | undefined
  /** Купонный период в днях. */
  couponPeriod: number
}

/** Данные по валюте. */
export interface CurrencyResponse {
  /** Информация о валюте. */
  instrument: Currency | undefined
}

/** Данные по валютам. */
export interface CurrenciesResponse {
  /** Массив валют. */
  instruments: Currency[]
}

/** Данные по фонду. */
export interface EtfResponse {
  /** Информация о фонде. */
  instrument: Etf | undefined
}

/** Данные по фондам. */
export interface EtfsResponse {
  /** Массив фондов. */
  instruments: Etf[]
}

/** Данные по фьючерсу. */
export interface FutureResponse {
  /** Информация о фьючерсу. */
  instrument: Future | undefined
}

/** Данные по фьючерсам. */
export interface FuturesResponse {
  /** Массив фьючерсов. */
  instruments: Future[]
}

/** Данные по акции. */
export interface ShareResponse {
  /** Информация об акции. */
  instrument: Share | undefined
}

/** Данные по акциям. */
export interface SharesResponse {
  /** Массив акций. */
  instruments: Share[]
}

/** Объект передачи информации об облигации. */
export interface Bond {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Тикер инструмента. */
  ticker: string
  /** Класс-код (секция торгов). */
  classCode: string
  /** Isin-идентификатор инструмента. */
  isin: string
  /** Лотность инструмента. Возможно совершение операций только на количества ценной бумаги, кратные параметру *lot*. Подробнее: [лот](https://tinkoff.github.io/investAPI/glossary#lot) */
  lot: number
  /** Валюта расчётов. */
  currency: string
  /** Коэффициент ставки риска длинной позиции по инструменту. */
  klong: Quotation | undefined
  /** Коэффициент ставки риска короткой позиции по инструменту. */
  kshort: Quotation | undefined
  /** Ставка риска минимальной маржи в лонг. Подробнее: [ставка риска в лонг](https://help.tinkoff.ru/margin-trade/long/risk-rate/) */
  dlong: Quotation | undefined
  /** Ставка риска минимальной маржи в шорт. Подробнее: [ставка риска в шорт](https://help.tinkoff.ru/margin-trade/short/risk-rate/) */
  dshort: Quotation | undefined
  /** Ставка риска начальной маржи в лонг. Подробнее: [ставка риска в лонг](https://help.tinkoff.ru/margin-trade/long/risk-rate/) */
  dlongMin: Quotation | undefined
  /** Ставка риска начальной маржи в шорт. Подробнее: [ставка риска в шорт](https://help.tinkoff.ru/margin-trade/short/risk-rate/) */
  dshortMin: Quotation | undefined
  /** Признак доступности для операций в шорт. */
  shortEnabledFlag: boolean
  /** Название инструмента. */
  name: string
  /** Торговая площадка. */
  exchange: string
  /** Количество выплат по купонам в год. */
  couponQuantityPerYear: number
  /** Дата погашения облигации в часовом поясе UTC. */
  maturityDate: Date | undefined
  /** Номинал облигации. */
  nominal: MoneyValue | undefined
  /** Дата выпуска облигации в часовом поясе UTC. */
  stateRegDate: Date | undefined
  /** Дата размещения в часовом поясе UTC. */
  placementDate: Date | undefined
  /** Цена размещения. */
  placementPrice: MoneyValue | undefined
  /** Значение НКД (накопленного купонного дохода) на дату. */
  aciValue: MoneyValue | undefined
  /** Код страны риска, т.е. страны, в которой компания ведёт основной бизнес. */
  countryOfRisk: string
  /** Наименование страны риска, т.е. страны, в которой компания ведёт основной бизнес. */
  countryOfRiskName: string
  /** Сектор экономики. */
  sector: string
  /** Форма выпуска. Возможные значения: </br>**documentary** — документарная; </br>**non_documentary** — бездокументарная. */
  issueKind: string
  /** Размер выпуска. */
  issueSize: number
  /** Плановый размер выпуска. */
  issueSizePlan: number
  /** Текущий режим торгов инструмента. */
  tradingStatus: SecurityTradingStatus
  /** Признак внебиржевой ценной бумаги. */
  otcFlag: boolean
  /** Признак доступности для покупки. */
  buyAvailableFlag: boolean
  /** Признак доступности для продажи. */
  sellAvailableFlag: boolean
  /** Признак облигации с плавающим купоном. */
  floatingCouponFlag: boolean
  /** Признак бессрочной облигации. */
  perpetualFlag: boolean
  /** Признак облигации с амортизацией долга. */
  amortizationFlag: boolean
  /** Шаг цены. */
  minPriceIncrement: Quotation | undefined
  /** Признак доступности торгов через API. */
  apiTradeAvailableFlag: boolean
  /** Уникальный идентификатор инструмента. */
  uid: string
  /** Реальная площадка исполнения расчётов. */
  realExchange: RealExchange
}

/** Объект передачи информации о валюте. */
export interface Currency {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Тикер инструмента. */
  ticker: string
  /** Класс-код (секция торгов). */
  classCode: string
  /** Isin-идентификатор инструмента. */
  isin: string
  /** Лотность инструмента. Возможно совершение операций только на количества ценной бумаги, кратные параметру *lot*. Подробнее: [лот](https://tinkoff.github.io/investAPI/glossary#lot) */
  lot: number
  /** Валюта расчётов. */
  currency: string
  /** Коэффициент ставки риска длинной позиции по инструменту. */
  klong: Quotation | undefined
  /** Коэффициент ставки риска короткой позиции по инструменту. */
  kshort: Quotation | undefined
  /** Ставка риска минимальной маржи в лонг. Подробнее: [ставка риска в лонг](https://help.tinkoff.ru/margin-trade/long/risk-rate/) */
  dlong: Quotation | undefined
  /** Ставка риска минимальной маржи в шорт. Подробнее: [ставка риска в шорт](https://help.tinkoff.ru/margin-trade/short/risk-rate/) */
  dshort: Quotation | undefined
  /** Ставка риска начальной маржи в лонг. Подробнее: [ставка риска в лонг](https://help.tinkoff.ru/margin-trade/long/risk-rate/) */
  dlongMin: Quotation | undefined
  /** Ставка риска начальной маржи в шорт. Подробнее: [ставка риска в шорт](https://help.tinkoff.ru/margin-trade/short/risk-rate/) */
  dshortMin: Quotation | undefined
  /** Признак доступности для операций в шорт. */
  shortEnabledFlag: boolean
  /** Название инструмента. */
  name: string
  /** Торговая площадка. */
  exchange: string
  /** Номинал. */
  nominal: MoneyValue | undefined
  /** Код страны риска, т.е. страны, в которой компания ведёт основной бизнес. */
  countryOfRisk: string
  /** Наименование страны риска, т.е. страны, в которой компания ведёт основной бизнес. */
  countryOfRiskName: string
  /** Текущий режим торгов инструмента. */
  tradingStatus: SecurityTradingStatus
  /** Признак внебиржевой ценной бумаги. */
  otcFlag: boolean
  /** Признак доступности для покупки. */
  buyAvailableFlag: boolean
  /** Признак доступности для продажи. */
  sellAvailableFlag: boolean
  /** Строковый ISO-код валюты. */
  isoCurrencyName: string
  /** Шаг цены. */
  minPriceIncrement: Quotation | undefined
  /** Признак доступности торгов через API. */
  apiTradeAvailableFlag: boolean
  /** Уникальный идентификатор инструмента. */
  uid: string
  /** Реальная площадка исполнения расчётов. */
  realExchange: RealExchange
}

/** Объект передачи информации об инвестиционном фонде. */
export interface Etf {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Тикер инструмента. */
  ticker: string
  /** Класс-код (секция торгов). */
  classCode: string
  /** Isin-идентификатор инструмента. */
  isin: string
  /** Лотность инструмента. Возможно совершение операций только на количества ценной бумаги, кратные параметру *lot*. Подробнее: [лот](https://tinkoff.github.io/investAPI/glossary#lot) */
  lot: number
  /** Валюта расчётов. */
  currency: string
  /** Коэффициент ставки риска длинной позиции по инструменту. */
  klong: Quotation | undefined
  /** Коэффициент ставки риска короткой позиции по инструменту. */
  kshort: Quotation | undefined
  /** Ставка риска минимальной маржи в лонг. Подробнее: [ставка риска в лонг](https://help.tinkoff.ru/margin-trade/long/risk-rate/) */
  dlong: Quotation | undefined
  /** Ставка риска минимальной маржи в шорт. Подробнее: [ставка риска в шорт](https://help.tinkoff.ru/margin-trade/short/risk-rate/) */
  dshort: Quotation | undefined
  /** Ставка риска начальной маржи в лонг. Подробнее: [ставка риска в лонг](https://help.tinkoff.ru/margin-trade/long/risk-rate/) */
  dlongMin: Quotation | undefined
  /** Ставка риска начальной маржи в шорт. Подробнее: [ставка риска в шорт](https://help.tinkoff.ru/margin-trade/short/risk-rate/) */
  dshortMin: Quotation | undefined
  /** Признак доступности для операций в шорт. */
  shortEnabledFlag: boolean
  /** Название инструмента. */
  name: string
  /** Торговая площадка. */
  exchange: string
  /** Размер фиксированной комиссии фонда. */
  fixedCommission: Quotation | undefined
  /** Возможные значения: </br>**equity** — акции;</br>**fixed_income** — облигации;</br>**mixed_allocation** — смешанный;</br>**money_market** — денежный рынок;</br>**real_estate** — недвижимость;</br>**commodity** — товары;</br>**specialty** — специальный;</br>**private_equity** — private equity;</br>**alternative_investment** — альтернативные инвестиции. */
  focusType: string
  /** Дата выпуска в часовом поясе UTC. */
  releasedDate: Date | undefined
  /** Количество акций фонда в обращении. */
  numShares: Quotation | undefined
  /** Код страны риска, т.е. страны, в которой компания ведёт основной бизнес. */
  countryOfRisk: string
  /** Наименование страны риска, т.е. страны, в которой компания ведёт основной бизнес. */
  countryOfRiskName: string
  /** Сектор экономики. */
  sector: string
  /** Частота ребалансировки. */
  rebalancingFreq: string
  /** Текущий режим торгов инструмента. */
  tradingStatus: SecurityTradingStatus
  /** Признак внебиржевой ценной бумаги. */
  otcFlag: boolean
  /** Признак доступности для покупки. */
  buyAvailableFlag: boolean
  /** Признак доступности для продажи. */
  sellAvailableFlag: boolean
  /** Шаг цены. */
  minPriceIncrement: Quotation | undefined
  /** Признак доступности торгов через API. */
  apiTradeAvailableFlag: boolean
  /** Уникальный идентификатор инструмента. */
  uid: string
  /** Реальная площадка исполнения расчётов. */
  realExchange: RealExchange
}

/** Объект передачи информации о фьючерсе. */
export interface Future {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Тикер инструмента. */
  ticker: string
  /** Класс-код (секция торгов). */
  classCode: string
  /** Лотность инструмента. Возможно совершение операций только на количества ценной бумаги, кратные параметру *lot*. Подробнее: [лот](https://tinkoff.github.io/investAPI/glossary#lot) */
  lot: number
  /** Валюта расчётов. */
  currency: string
  /** Коэффициент ставки риска длинной позиции по клиенту. */
  klong: Quotation | undefined
  /** Коэффициент ставки риска короткой позиции по клиенту. */
  kshort: Quotation | undefined
  /** Ставка риска минимальной маржи в лонг. Подробнее: [ставка риска в лонг](https://help.tinkoff.ru/margin-trade/long/risk-rate/) */
  dlong: Quotation | undefined
  /** Ставка риска минимальной маржи в шорт. Подробнее: [ставка риска в шорт](https://help.tinkoff.ru/margin-trade/short/risk-rate/) */
  dshort: Quotation | undefined
  /** Ставка риска начальной маржи в лонг. Подробнее: [ставка риска в лонг](https://help.tinkoff.ru/margin-trade/long/risk-rate/) */
  dlongMin: Quotation | undefined
  /** Ставка риска начальной маржи в шорт. Подробнее: [ставка риска в шорт](https://help.tinkoff.ru/margin-trade/short/risk-rate/) */
  dshortMin: Quotation | undefined
  /** Признак доступности для операций шорт. */
  shortEnabledFlag: boolean
  /** Название инструмента. */
  name: string
  /** Торговая площадка. */
  exchange: string
  /** Дата начала обращения контракта в часовом поясе UTC. */
  firstTradeDate: Date | undefined
  /** Дата в часовом поясе UTC, до которой возможно проведение операций с фьючерсом. */
  lastTradeDate: Date | undefined
  /** Тип фьючерса. Возможные значения: </br>**physical_delivery** — физические поставки; </br>**cash_settlement** — денежный эквивалент. */
  futuresType: string
  /** Тип актива. Возможные значения: </br>**commodity** — товар; </br>**currency** — валюта; </br>**security** — ценная бумага; </br>**index** — индекс. */
  assetType: string
  /** Основной актив. */
  basicAsset: string
  /** Размер основного актива. */
  basicAssetSize: Quotation | undefined
  /** Код страны риска, т.е. страны, в которой компания ведёт основной бизнес. */
  countryOfRisk: string
  /** Наименование страны риска, т.е. страны, в которой компания ведёт основной бизнес. */
  countryOfRiskName: string
  /** Сектор экономики. */
  sector: string
  /** Дата истечения срока в часов поясе UTC. */
  expirationDate: Date | undefined
  /** Текущий режим торгов инструмента. */
  tradingStatus: SecurityTradingStatus
  /** Признак внебиржевой ценной бумаги. */
  otcFlag: boolean
  /** Признак доступности для покупки. */
  buyAvailableFlag: boolean
  /** Признак доступности для продажи. */
  sellAvailableFlag: boolean
  /** Шаг цены. */
  minPriceIncrement: Quotation | undefined
  /** Признак доступности торгов через API. */
  apiTradeAvailableFlag: boolean
  /** Уникальный идентификатор инструмента. */
  uid: string
  /** Реальная площадка исполнения расчётов. */
  realExchange: RealExchange
}

/** Объект передачи информации об акции. */
export interface Share {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Тикер инструмента. */
  ticker: string
  /** Класс-код (секция торгов). */
  classCode: string
  /** Isin-идентификатор инструмента. */
  isin: string
  /** Лотность инструмента. Возможно совершение операций только на количества ценной бумаги, кратные параметру *lot*. Подробнее: [лот](https://tinkoff.github.io/investAPI/glossary#lot) */
  lot: number
  /** Валюта расчётов. */
  currency: string
  /** Коэффициент ставки риска длинной позиции по инструменту. */
  klong: Quotation | undefined
  /** Коэффициент ставки риска короткой позиции по инструменту. */
  kshort: Quotation | undefined
  /** Ставка риска минимальной маржи в лонг. Подробнее: [ставка риска в лонг](https://help.tinkoff.ru/margin-trade/long/risk-rate/) */
  dlong: Quotation | undefined
  /** Ставка риска минимальной маржи в шорт. Подробнее: [ставка риска в шорт](https://help.tinkoff.ru/margin-trade/short/risk-rate/) */
  dshort: Quotation | undefined
  /** Ставка риска начальной маржи в лонг. Подробнее: [ставка риска в лонг](https://help.tinkoff.ru/margin-trade/long/risk-rate/) */
  dlongMin: Quotation | undefined
  /** Ставка риска начальной маржи в шорт. Подробнее: [ставка риска в шорт](https://help.tinkoff.ru/margin-trade/short/risk-rate/) */
  dshortMin: Quotation | undefined
  /** Признак доступности для операций в шорт. */
  shortEnabledFlag: boolean
  /** Название инструмента. */
  name: string
  /** Торговая площадка. */
  exchange: string
  /** Дата IPO акции в часовом поясе UTC. */
  ipoDate: Date | undefined
  /** Размер выпуска. */
  issueSize: number
  /** Код страны риска, т.е. страны, в которой компания ведёт основной бизнес. */
  countryOfRisk: string
  /** Наименование страны риска, т.е. страны, в которой компания ведёт основной бизнес. */
  countryOfRiskName: string
  /** Сектор экономики. */
  sector: string
  /** Плановый размер выпуска. */
  issueSizePlan: number
  /** Номинал. */
  nominal: MoneyValue | undefined
  /** Текущий режим торгов инструмента. */
  tradingStatus: SecurityTradingStatus
  /** Признак внебиржевой ценной бумаги. */
  otcFlag: boolean
  /** Признак доступности для покупки. */
  buyAvailableFlag: boolean
  /** Признак доступности для продажи. */
  sellAvailableFlag: boolean
  /** Признак наличия дивидендной доходности. */
  divYieldFlag: boolean
  /** Тип акции. Возможные значения: [ShareType](https://tinkoff.github.io/investAPI/instruments#sharetype) */
  shareType: ShareType
  /** Шаг цены. */
  minPriceIncrement: Quotation | undefined
  /** Признак доступности торгов через API. */
  apiTradeAvailableFlag: boolean
  /** Уникальный идентификатор инструмента. */
  uid: string
  /** Реальная площадка исполнения расчётов. */
  realExchange: RealExchange
}

/** Запрос НКД по облигации */
export interface GetAccruedInterestsRequest {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Начало запрашиваемого периода в часовом поясе UTC. */
  from: Date | undefined
  /** Окончание запрашиваемого периода в часовом поясе UTC. */
  to: Date | undefined
}

/** НКД облигации */
export interface GetAccruedInterestsResponse {
  /** Массив операций начисления купонов. */
  accruedInterests: AccruedInterest[]
}

/** Операция начисления купонов. */
export interface AccruedInterest {
  /** Дата и время выплаты в часовом поясе UTC. */
  date: Date | undefined
  /** Величина выплаты. */
  value: Quotation | undefined
  /** Величина выплаты в процентах от номинала. */
  valuePercent: Quotation | undefined
  /** Номинал облигации. */
  nominal: Quotation | undefined
}

/** Запрос информации о фьючерсе */
export interface GetFuturesMarginRequest {
  /** Идентификатор инструмента. */
  figi: string
}

/** Данные по фьючерсу */
export interface GetFuturesMarginResponse {
  /** Гарантийное обеспечение при покупке. */
  initialMarginOnBuy: MoneyValue | undefined
  /** Гарантийное обеспечение при продаже. */
  initialMarginOnSell: MoneyValue | undefined
  /** Шаг цены. */
  minPriceIncrement: Quotation | undefined
  /** Стоимость шага цены. */
  minPriceIncrementAmount: Quotation | undefined
}

/** Данные по инструменту. */
export interface InstrumentResponse {
  /** Основная информация об инструменте. */
  instrument: Instrument | undefined
}

/** Объект передачи основной информации об инструменте. */
export interface Instrument {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Тикер инструмента. */
  ticker: string
  /** Класс-код инструмента. */
  classCode: string
  /** Isin-идентификатор инструмента. */
  isin: string
  /** Лотность инструмента. Возможно совершение операций только на количества ценной бумаги, кратные параметру *lot*. Подробнее: [лот](https://tinkoff.github.io/investAPI/glossary#lot) */
  lot: number
  /** Валюта расчётов. */
  currency: string
  /** Коэффициент ставки риска длинной позиции по инструменту. */
  klong: Quotation | undefined
  /** Коэффициент ставки риска короткой позиции по инструменту. */
  kshort: Quotation | undefined
  /** Ставка риска минимальной маржи в лонг. Подробнее: [ставка риска в лонг](https://help.tinkoff.ru/margin-trade/long/risk-rate/) */
  dlong: Quotation | undefined
  /** Ставка риска минимальной маржи в шорт. Подробнее: [ставка риска в шорт](https://help.tinkoff.ru/margin-trade/short/risk-rate/) */
  dshort: Quotation | undefined
  /** Ставка риска начальной маржи в лонг. Подробнее: [ставка риска в лонг](https://help.tinkoff.ru/margin-trade/long/risk-rate/) */
  dlongMin: Quotation | undefined
  /** Ставка риска начальной маржи в шорт. Подробнее: [ставка риска в шорт](https://help.tinkoff.ru/margin-trade/short/risk-rate/) */
  dshortMin: Quotation | undefined
  /** Признак доступности для операций в шорт. */
  shortEnabledFlag: boolean
  /** Название инструмента. */
  name: string
  /** Торговая площадка. */
  exchange: string
  /** Код страны риска, т.е. страны, в которой компания ведёт основной бизнес. */
  countryOfRisk: string
  /** Наименование страны риска, т.е. страны, в которой компания ведёт основной бизнес. */
  countryOfRiskName: string
  /** Тип инструмента. */
  instrumentType: string
  /** Текущий режим торгов инструмента. */
  tradingStatus: SecurityTradingStatus
  /** Признак внебиржевой ценной бумаги. */
  otcFlag: boolean
  /** Признак доступности для покупки. */
  buyAvailableFlag: boolean
  /** Признак доступности для продажи. */
  sellAvailableFlag: boolean
  /** Шаг цены. */
  minPriceIncrement: Quotation | undefined
  /** Признак доступности торгов через API. */
  apiTradeAvailableFlag: boolean
  /** Уникальный идентификатор инструмента. */
  uid: string
  /** Реальная площадка исполнения расчётов. */
  realExchange: RealExchange
}

/** Запрос дивидендов. */
export interface GetDividendsRequest {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Начало запрашиваемого периода в часовом поясе UTC. Фильтрация происходит по параметру *record_date* (дата фиксации реестра). */
  from: Date | undefined
  /** Окончание запрашиваемого периода в часовом поясе UTC. Фильтрация происходит по параметру *record_date* (дата фиксации реестра). */
  to: Date | undefined
}

/** Дивиденды. */
export interface GetDividendsResponse {
  dividends: Dividend[]
}

/** Информация о выплате. */
export interface Dividend {
  /** Величина дивиденда на 1 ценную бумагу (включая валюту). */
  dividendNet: MoneyValue | undefined
  /** Дата фактических выплат в часовом поясе UTC. */
  paymentDate: Date | undefined
  /** Дата объявления дивидендов в часовом поясе UTC. */
  declaredDate: Date | undefined
  /** Последний день (включительно) покупки для получения выплаты в часовом поясе UTC. */
  lastBuyDate: Date | undefined
  /** Тип выплаты. Возможные значения: Regular Cash – регулярные выплаты, Cancelled – выплата отменена, Daily Accrual – ежедневное начисление, Return of Capital – возврат капитала, прочие типы выплат. */
  dividendType: string
  /** Дата фиксации реестра в часовом поясе UTC. */
  recordDate: Date | undefined
  /** Регулярность выплаты. Возможные значения: Annual – ежегодная, Semi-Anl – каждые полгода, прочие типы выплат. */
  regularity: string
  /** Цена закрытия инструмента на момент ex_dividend_date. */
  closePrice: MoneyValue | undefined
  /** Величина доходности. */
  yieldValue: Quotation | undefined
  /** Дата и время создания записи в часовом поясе UTC. */
  createdAt: Date | undefined
}

/** Запрос актива по идентификатору. */
export interface AssetRequest {
  /** uid-идентификатор актива. */
  id: string
}

/** Данные по активу. */
export interface AssetResponse {
  /** Актив. */
  asset: AssetFull | undefined
}

/** Запрос списка активов. */
export interface AssetsRequest {}

/** Список активов. */
export interface AssetsResponse {
  /** Активы. */
  assets: Asset[]
}

export interface AssetFull {
  /** Уникальный идентификатор актива. */
  uid: string
  /** Тип актива. */
  type: AssetType
  /** Наименование актива. */
  name: string
  /** Короткое наименование актива. */
  nameBrief: string
  /** Описание актива. */
  description: string
  /** Дата и время удаления актива. */
  deletedAt: Date | undefined
  /** Тестирование клиентов. */
  requiredTests: string[]
  /** Валюта. Обязательно и заполняется только для type = "ASSET_TYPE_CURRENCY". */
  currency: AssetCurrency | undefined
  /** Ценная бумага. Обязательно и заполняется только для type = "ASSET_TYPE_SECURITY". */
  security: AssetSecurity | undefined
  /** Номер государственной регистрации. */
  gosRegCode: string
  /** Код CFI. */
  cfi: string
  /** Код НРД инструмента. */
  codeNsd: string
  /** Статус актива. */
  status: string
  /** Бренд. */
  brand: Brand | undefined
  /** Дата и время последнего обновления записи. */
  updatedAt: Date | undefined
  /** Код типа ц.б. по классификации Банка России. */
  brCode: string
  /** Наименование кода типа ц.б. по классификации Банка России. */
  brCodeName: string
  /** Массив идентификаторов инструментов. */
  instruments: AssetInstrument[]
}

/** Информация об активе. */
export interface Asset {
  /** Уникальный идентификатор актива. */
  uid: string
  /** Тип актива. */
  type: AssetType
  /** Наименование актива. */
  name: string
  /** Массив идентификаторов инструментов. */
  instruments: AssetInstrument[]
}

/** Валюта. */
export interface AssetCurrency {
  /** ISO-код валюты. */
  baseCurrency: string
}

/** Ценная бумага. */
export interface AssetSecurity {
  /** ISIN-идентификатор ценной бумаги. */
  isin: string
  /** Тип ценной бумаги. */
  type: string
  /** Акция. Заполняется только для акций (тип актива asset.type = "ASSET_TYPE_SECURITY" и security.type = share). */
  share: AssetShare | undefined
  /** Облигация. Заполняется только для облигаций (тип актива asset.type = "ASSET_TYPE_SECURITY" и security.type = bond). */
  bond: AssetBond | undefined
  /** Структурная нота. Заполняется только для структурных продуктов (тип актива asset.type = "ASSET_TYPE_SECURITY" и security.type = sp). */
  sp: AssetStructuredProduct | undefined
  /** Фонд. Заполняется только для фондов (тип актива asset.type = "ASSET_TYPE_SECURITY" и security.type = etf). */
  etf: AssetEtf | undefined
  /** Клиринговый сертификат участия. Заполняется только для клиринговых сертификатов (тип актива asset.type = "ASSET_TYPE_SECURITY" и security.type = clearing_certificate). */
  clearingCertificate: AssetClearingCertificate | undefined
}

/** Акция. */
export interface AssetShare {
  /** Тип акции. */
  type: ShareType
  /** Объем выпуска (шт.). */
  issueSize: Quotation | undefined
  /** Номинал. */
  nominal: Quotation | undefined
  /** Валюта номинала. */
  nominalCurrency: string
  /** Индекс (Bloomberg). */
  primaryIndex: string
  /** Ставка дивиденда (для привилегированных акций). */
  dividendRate: Quotation | undefined
  /** Тип привилегированных акций. */
  preferredShareType: string
  /** Дата IPO. */
  ipoDate: Date | undefined
  /** Дата регистрации. */
  registryDate: Date | undefined
  /** Признак наличия дивидендной доходности. */
  divYieldFlag: boolean
  /** Форма выпуска ФИ. */
  issueKind: string
  /** Дата размещения акции. */
  placementDate: Date | undefined
  /** ISIN базового актива. */
  represIsin: string
  /** Объявленное количество шт. */
  issueSizePlan: Quotation | undefined
  /** Количество акций в свободном обращении. */
  totalFloat: Quotation | undefined
}

/** Облигация. */
export interface AssetBond {
  /** Текущий номинал. */
  currentNominal: Quotation | undefined
  /** Наименование заемщика. */
  borrowName: string
  /** Объем эмиссии облигации (стоимость). */
  issueSize: Quotation | undefined
  /** Номинал облигации. */
  nominal: Quotation | undefined
  /** Валюта номинала. */
  nominalCurrency: string
  /** Форма выпуска облигации. */
  issueKind: string
  /** Форма дохода облигации. */
  interestKind: string
  /** Количество выплат в год. */
  couponQuantityPerYear: number
  /** Признак облигации с индексируемым номиналом. */
  indexedNominalFlag: boolean
  /** Признак субординированной облигации. */
  subordinatedFlag: boolean
  /** Признак обеспеченной облигации. */
  collateralFlag: boolean
  /** Признак показывает, что купоны облигации не облагаются налогом (для mass market). */
  taxFreeFlag: boolean
  /** Признак облигации с амортизацией долга. */
  amortizationFlag: boolean
  /** Признак облигации с плавающим купоном. */
  floatingCouponFlag: boolean
  /** Признак бессрочной облигации. */
  perpetualFlag: boolean
  /** Дата погашения облигации. */
  maturityDate: Date | undefined
  /** Описание и условия получения дополнительного дохода. */
  returnCondition: string
  /** Дата выпуска облигации. */
  stateRegDate: Date | undefined
  /** Дата размещения облигации. */
  placementDate: Date | undefined
  /** Цена размещения облигации. */
  placementPrice: Quotation | undefined
  /** Объявленное количество шт. */
  issueSizePlan: Quotation | undefined
}

/** Структурная нота. */
export interface AssetStructuredProduct {
  /** Наименование заемщика. */
  borrowName: string
  /** Номинал. */
  nominal: Quotation | undefined
  /** Валюта номинала. */
  nominalCurrency: string
  /** Тип структурной ноты. */
  type: StructuredProductType
  /** Стратегия портфеля. */
  logicPortfolio: string
  /** Тип базового актива. */
  assetType: AssetType
  /** Вид базового актива в зависимости от типа базового актива. */
  basicAsset: string
  /** Барьер сохранности (в процентах). */
  safetyBarrier: Quotation | undefined
  /** Дата погашения. */
  maturityDate: Date | undefined
  /** Объявленное количество шт. */
  issueSizePlan: Quotation | undefined
  /** Объем размещения. */
  issueSize: Quotation | undefined
  /** Дата размещения ноты. */
  placementDate: Date | undefined
  /** Форма выпуска. */
  issueKind: string
}

/** Фонд. */
export interface AssetEtf {
  /** Суммарные расходы фонда (в %). */
  totalExpense: Quotation | undefined
  /** Барьерная ставка доходности после которой фонд имеет право на perfomance fee (в процентах). */
  hurdleRate: Quotation | undefined
  /** Комиссия за успешные результаты фонда (в процентах). */
  performanceFee: Quotation | undefined
  /** Фиксированная комиссия за управление (в процентах). */
  fixedCommission: Quotation | undefined
  /** Тип распределения доходов от выплат по бумагам. */
  paymentType: string
  /** Признак необходимости выхода фонда в плюс для получения комиссии. */
  watermarkFlag: boolean
  /** Премия (надбавка к цене) при покупке доли в фонде (в процентах). */
  buyPremium: Quotation | undefined
  /** Ставка дисконта (вычет из цены) при продаже доли в фонде (в процентах). */
  sellDiscount: Quotation | undefined
  /** Признак ребалансируемости портфеля фонда. */
  rebalancingFlag: boolean
  /** Периодичность ребалансировки. */
  rebalancingFreq: string
  /** Тип управления. */
  managementType: string
  /** Индекс, который реплицирует (старается копировать) фонд. */
  primaryIndex: string
  /** База ETF. */
  focusType: string
  /** Признак использования заемных активов (плечо). */
  leveragedFlag: boolean
  /** Количество акций в обращении. */
  numShare: Quotation | undefined
  /** Признак обязательства по отчетности перед регулятором. */
  ucitsFlag: boolean
  /** Дата выпуска. */
  releasedDate: Date | undefined
  /** Описание фонда. */
  description: string
  /** Описание индекса, за которым следует фонд. */
  primaryIndexDescription: string
  /** Основные компании, в которые вкладывается фонд. */
  primaryIndexCompany: string
  /** Срок восстановления индекса (после просадки). */
  indexRecoveryPeriod: Quotation | undefined
  /** IVAV-код. */
  inavCode: string
  /** Признак наличия дивидендной доходности. */
  divYieldFlag: boolean
  /** Комиссия на покрытие расходов фонда (в процентах). */
  expenseCommission: Quotation | undefined
  /** Ошибка следования за индексом (в процентах). */
  primaryIndexTrackingError: Quotation | undefined
  /** Плановая ребалансировка портфеля. */
  rebalancingPlan: string
  /** Ставки налогообложения дивидендов и купонов. */
  taxRate: string
  /** Даты ребалансировок. */
  rebalancingDates: Date[]
  /** Форма выпуска. */
  issueKind: string
  /** Номинал. */
  nominal: Quotation | undefined
  /** Валюта номинала. */
  nominalCurrency: string
}

/** Клиринговый сертификат участия. */
export interface AssetClearingCertificate {
  /** Номинал. */
  nominal: Quotation | undefined
  /** Валюта номинала. */
  nominalCurrency: string
}

/** Бренд. */
export interface Brand {
  /** uid идентификатор бренда. */
  uid: string
  /** Наименование бренда. */
  name: string
  /** Описание. */
  description: string
  /** Информация о бренде. */
  info: string
  /** Компания. */
  company: string
  /** Сектор. */
  sector: string
  /** Код страны риска. */
  countryOfRisk: string
  /** Наименование страны риска. */
  countryOfRiskName: string
}

/** Идентификаторы инструмента. */
export interface AssetInstrument {
  /** uid идентификатор инструмента. */
  uid: string
  /** figi идентификатор инструмента. */
  figi: string
  /** Тип инструмента. */
  instrumentType: string
  /** Тикер инструмента. */
  ticker: string
  /** Класс-код (секция торгов). */
  classCode: string
  /** Массив связанных инструментов. */
  links: InstrumentLink[]
}

/** Связь с другим инструментом. */
export interface InstrumentLink {
  /** Тип связи. */
  type: string
  /** uid идентификатор связанного инструмента. */
  instrumentUid: string
}

/** Запрос избранных инструментов. */
export interface GetFavoritesRequest {}

/** Ответ избранных инструментов. */
export interface GetFavoritesResponse {
  /** Массив инструментов */
  favoriteInstruments: FavoriteInstrument[]
}

/** Избранный инструмент. */
export interface FavoriteInstrument {
  /** Figi-идентификатор инструмента. */
  figi: string
  /** Тикер инструмента. */
  ticker: string
  /** Класс-код инструмента. */
  classCode: string
  /** Isin-идентификатор инструмента. */
  isin: string
  /** Тип инструмента. */
  instrumentType: string
  /** Признак внебиржевой ценной бумаги. */
  otcFlag: boolean
  /** Признак доступности торгов через API. */
  apiTradeAvailableFlag: boolean
}

/** Запрос редактирования избранных инструментов. */
export interface EditFavoritesRequest {
  /** Массив инструментов. */
  instruments: EditFavoritesRequestInstrument[]
  /** Тип действия со списком. */
  actionType: EditFavoritesActionType
}

/** Избранный инструмент для редактирования. */
export interface EditFavoritesRequestInstrument {
  /** Figi-идентификатор инструмента. */
  figi: string
}

/** Результат редактирования избранных инструментов. */
export interface EditFavoritesResponse {
  /** Массив инструментов */
  favoriteInstruments: FavoriteInstrument[]
}

/** Запрос справочника стран. */
export interface GetCountriesRequest {}

/** Справочник стран. */
export interface GetCountriesResponse {
  /** Массив стран. */
  countries: CountryResponse[]
}

/** Данные о стране. */
export interface CountryResponse {
  /** Двухбуквенный код страны. */
  alfaTwo: string
  /** Трёхбуквенный код страны. */
  alfaThree: string
  /** Наименование страны. */
  name: string
  /** Краткое наименование страны. */
  nameBrief: string
}

/** Запрос на поиск инструментов. */
export interface FindInstrumentRequest {
  /** Строка поиска. */
  query: string
}

/** Результат поиска инструментов. */
export interface FindInstrumentResponse {
  /** Массив инструментов, удовлетворяющих условиям поиска. */
  instruments: InstrumentShort[]
}

/** Краткая информация об инструменте. */
export interface InstrumentShort {
  /** Isin инструмента. */
  isin: string
  /** Figi инструмента. */
  figi: string
  /** Ticker инструмента. */
  ticker: string
  /** ClassCode инструмента. */
  classCode: string
  /** Тип инструмента. */
  instrumentType: string
  /** Название инструмента. */
  name: string
  /** Уникальный идентификатор инструмента. */
  uid: string
}

/** Запрос списка брендов. */
export interface GetBrandsRequest {}

/** Запрос бренда. */
export interface GetBrandRequest {
  /** Uid-идентификатор бренда. */
  id: string
}

/** Список брендов. */
export interface GetBrandsResponse {
  /** Массив брендов. */
  brands: Brand[]
}

/**
 * Сервис предназначен для получения:</br>**1**. информации об инструментах;</br>**2**.
 * расписания торговых сессий;</br>**3**. календаря выплат купонов по облигациям;</br>**4**.
 * размера гарантийного обеспечения по фьючерсам;</br>**5**. дивидендов по ценной бумаге.
 */
export interface InstrumentsService {
  /** Метод получения расписания торгов торговых площадок. */
  TradingSchedules: (
    request: TradingSchedulesRequest
  ) => Promise<TradingSchedulesResponse>
  /** Метод получения облигации по её идентификатору. */
  BondBy: (request: InstrumentRequest) => Promise<BondResponse>
  /** Метод получения списка облигаций. */
  Bonds: (request: InstrumentsRequest) => Promise<BondsResponse>
  /** Метод получения графика выплат купонов по облигации */
  GetBondCoupons: (
    request: GetBondCouponsRequest
  ) => Promise<GetBondCouponsResponse>
  /** Метод получения валюты по её идентификатору. */
  CurrencyBy: (request: InstrumentRequest) => Promise<CurrencyResponse>
  /** Метод получения списка валют. */
  Currencies: (request: InstrumentsRequest) => Promise<CurrenciesResponse>
  /** Метод получения инвестиционного фонда по его идентификатору. */
  EtfBy: (request: InstrumentRequest) => Promise<EtfResponse>
  /** Метод получения списка инвестиционных фондов. */
  Etfs: (request: InstrumentsRequest) => Promise<EtfsResponse>
  /** Метод получения фьючерса по его идентификатору. */
  FutureBy: (request: InstrumentRequest) => Promise<FutureResponse>
  /** Метод получения списка фьючерсов. */
  Futures: (request: InstrumentsRequest) => Promise<FuturesResponse>
  /** Метод получения акции по её идентификатору. */
  ShareBy: (request: InstrumentRequest) => Promise<ShareResponse>
  /** Метод получения списка акций. */
  Shares: (request: InstrumentsRequest) => Promise<SharesResponse>
  /** Метод получения накопленного купонного дохода по облигации. */
  GetAccruedInterests: (
    request: GetAccruedInterestsRequest
  ) => Promise<GetAccruedInterestsResponse>
  /** Метод получения размера гарантийного обеспечения по фьючерсам. */
  GetFuturesMargin: (
    request: GetFuturesMarginRequest
  ) => Promise<GetFuturesMarginResponse>
  /** Метод получения основной информации об инструменте. */
  GetInstrumentBy: (request: InstrumentRequest) => Promise<InstrumentResponse>
  /** Метод для получения событий выплаты дивидендов по инструменту. */
  GetDividends: (request: GetDividendsRequest) => Promise<GetDividendsResponse>
  /** Метод получения актива по его идентификатору. */
  GetAssetBy: (request: AssetRequest) => Promise<AssetResponse>
  /** Метод получения списка активов. */
  GetAssets: (request: AssetsRequest) => Promise<AssetsResponse>
  /** Метод получения избранных инструментов. */
  GetFavorites: (request: GetFavoritesRequest) => Promise<GetFavoritesResponse>
  /** Метод редактирования избранных инструментов. */
  EditFavorites: (request: EditFavoritesRequest) => Promise<EditFavoritesResponse>
  /** Метод получения списка стран. */
  GetCountries: (request: GetCountriesRequest) => Promise<GetCountriesResponse>
  /** Метод поиска инструмента. */
  FindInstrument: (
    request: FindInstrumentRequest
  ) => Promise<FindInstrumentResponse>
  /** Метод получения списка брендов. */
  GetBrands: (request: GetBrandsRequest) => Promise<GetBrandsResponse>
  /** Метод получения бренда по его идентификатору. */
  GetBrandBy: (request: GetBrandRequest) => Promise<Brand>
}
