import type { MoneyValue, Quotation } from './common'

/** Тип счёта. */
export enum AccountType {
  /** ACCOUNT_TYPE_UNSPECIFIED - Тип аккаунта не определён. */
  ACCOUNT_TYPE_UNSPECIFIED,
  /** ACCOUNT_TYPE_TINKOFF - Брокерский счёт Тинькофф. */
  ACCOUNT_TYPE_TINKOFF,
  /** ACCOUNT_TYPE_TINKOFF_IIS - ИИС счёт. */
  ACCOUNT_TYPE_TINKOFF_IIS,
  /** ACCOUNT_TYPE_INVEST_BOX - Инвесткопилка. */
  ACCOUNT_TYPE_INVEST_BOX,
  UNRECOGNIZED,
}

/** Статус счёта. */
export enum AccountStatus {
  /** ACCOUNT_STATUS_UNSPECIFIED - Статус счёта не определён. */
  ACCOUNT_STATUS_UNSPECIFIED,
  /** ACCOUNT_STATUS_NEW - Новый, в процессе открытия. */
  ACCOUNT_STATUS_NEW,
  /** ACCOUNT_STATUS_OPEN - Открытый и активный счёт. */
  ACCOUNT_STATUS_OPEN,
  /** ACCOUNT_STATUS_CLOSED - Закрытый счёт. */
  ACCOUNT_STATUS_CLOSED
}

/** Уровень доступа к счёту. */
export enum AccessLevel {
  /** ACCOUNT_ACCESS_LEVEL_UNSPECIFIED - Уровень доступа не определён. */
  ACCOUNT_ACCESS_LEVEL_UNSPECIFIED,
  /** ACCOUNT_ACCESS_LEVEL_FULL_ACCESS - Полный доступ к счёту. */
  ACCOUNT_ACCESS_LEVEL_FULL_ACCESS,
  /** ACCOUNT_ACCESS_LEVEL_READ_ONLY - Доступ с уровнем прав "только чтение". */
  ACCOUNT_ACCESS_LEVEL_READ_ONLY,
  /** ACCOUNT_ACCESS_LEVEL_NO_ACCESS - Доступ отсутствует. */
  ACCOUNT_ACCESS_LEVEL_NO_ACCESS,
  UNRECOGNIZED,
}

/** Запрос получения счетов пользователя. */
export interface GetAccountsRequest {}

/** Список счетов пользователя. */
export interface GetAccountsResponse {
  /** Массив счетов клиента. */
  accounts: Account[]
}

/** Информация о счёте. */
export interface Account {
  /** Идентификатор счёта. */
  id: string
  /** Тип счёта. */
  type: AccountType
  /** Название счёта. */
  name: string
  /** Статус счёта. */
  status: AccountStatus
  /** Дата открытия счёта в часовом поясе UTC. */
  openedDate: Date | undefined
  /** Дата закрытия счёта в часовом поясе UTC. */
  closedDate: Date | undefined
  /** Уровень доступа к текущему счёту (определяется токеном). */
  accessLevel: AccessLevel
}

/** Запрос маржинальных показателей по счёту */
export interface GetMarginAttributesRequest {
  /** Идентификатор счёта пользователя. */
  accountId: string
}

/** Маржинальные показатели по счёту. */
export interface GetMarginAttributesResponse {
  /** Ликвидная стоимость портфеля. Подробнее: [что такое ликвидный портфель?](https://help.tinkoff.ru/margin-trade/short/liquid-portfolio/). */
  liquidPortfolio: MoneyValue | undefined
  /** Начальная маржа — начальное обеспечение для совершения новой сделки. Подробнее: [начальная и минимальная маржа](https://help.tinkoff.ru/margin-trade/short/initial-and-maintenance-margin/). */
  startingMargin: MoneyValue | undefined
  /** Минимальная маржа — это минимальное обеспечение для поддержания позиции, которую вы уже открыли. Подробнее: [начальная и минимальная маржа](https://help.tinkoff.ru/margin-trade/short/initial-and-maintenance-margin/). */
  minimalMargin: MoneyValue | undefined
  /** Уровень достаточности средств. Соотношение стоимости ликвидного портфеля к начальной марже. */
  fundsSufficiencyLevel: Quotation | undefined
  /** Объем недостающих средств. Разница между стартовой маржой и ликвидной стоимости портфеля. */
  amountOfMissingFunds: MoneyValue | undefined
}

/** Запрос текущих лимитов пользователя. */
export interface GetUserTariffRequest {}

/** Текущие лимиты пользователя. */
export interface GetUserTariffResponse {
  /** Массив лимитов пользователя по unary-запросам */
  unaryLimits: UnaryLimit[]
  /** Массив лимитов пользователей для stream-соединений */
  streamLimits: StreamLimit[]
}

/** Лимит unary-методов. */
export interface UnaryLimit {
  /** Количество unary-запросов в минуту */
  limitPerMinute: number
  /** Названия методов */
  methods: string[]
}

/** Лимит stream-соединений. */
export interface StreamLimit {
  /** Максимальное количество stream-соединений */
  limit: number
  /** Названия stream-методов */
  streams: string[]
}

/** Запрос информации о пользователе. */
export interface GetInfoRequest {}

/** Информация о пользователе. */
export interface GetInfoResponse {
  /** Признак премиум клиента. */
  premStatus: boolean
  /** Признак квалифицированного инвестора. */
  qualStatus: boolean
  /** Набор требующих тестирования инструментов и возможностей, с которыми может работать пользователь. [Подробнее](https://tinkoff.github.io/investAPI/faq_users/). */
  qualifiedForWorkWith: string[]
  /** Наименование тарифа пользователя. */
  tariff: string
}

/**
 * Сервис предназначен для получения: </br> **1**.
 * списка счетов пользователя; </br> **2**. маржинальных показателей по счёту.
 */
export interface UsersService {
  /** Метод получения счетов пользователя. */
  GetAccounts: (request: GetAccountsRequest) => Promise<GetAccountsResponse>
  /** Расчёт маржинальных показателей по счёту. */
  GetMarginAttributes: (
    request: GetMarginAttributesRequest
  ) => Promise<GetMarginAttributesResponse>
  /** Запрос тарифа пользователя. */
  GetUserTariff: (request: GetUserTariffRequest) => Promise<GetUserTariffResponse>
  /** Метод получения информации о пользователе. */
  GetInfo: (request: GetInfoRequest) => Promise<GetInfoResponse>
}
