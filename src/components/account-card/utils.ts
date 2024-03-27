import {AccessLevel, AccountStatus, AccountType} from '../../types/tinkoff/users.ts'

export const getAccountTypeInfo = (type: AccountType): string => {
  switch (type) {
    case AccountType.ACCOUNT_TYPE_UNSPECIFIED: return 'Тип аккаунта не определён'
    case AccountType.ACCOUNT_TYPE_TINKOFF_IIS: return 'ИИС счёт'
    case AccountType.ACCOUNT_TYPE_INVEST_BOX: return 'Инвесткопилка'
    default: return 'Брокерский счёт Тинькофф'
  }
}

export const getAccountStatusInfo = (status: AccountStatus): string => {
  switch (status) {
    case AccountStatus.ACCOUNT_STATUS_NEW: return 'Новый, в процессе открытия'
    case AccountStatus.ACCOUNT_STATUS_OPEN: return 'Открытый и активный счёт'
    case AccountStatus.ACCOUNT_STATUS_CLOSED: return 'Закрытый счёт'
    default: return 'Статус счёта не определён'
  }
}

export const getAccountAccessLevelInfo = (accessLevel: AccessLevel): string => {
  switch (accessLevel) {
    case AccessLevel.ACCOUNT_ACCESS_LEVEL_FULL_ACCESS: return 'Полный доступ к счёту'
    case AccessLevel.ACCOUNT_ACCESS_LEVEL_READ_ONLY: return 'Доступ с уровнем прав "только чтение"'
    case AccessLevel.ACCOUNT_ACCESS_LEVEL_NO_ACCESS: return 'Доступ отсутствует'
    default: return 'Уровень доступа не определён'
  }
}

