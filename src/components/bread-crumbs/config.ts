import type { BreadCrumbsItem } from '../../types/bread-crumbs.ts'

export const breadCrumbsConfig: Record<string, BreadCrumbsItem[]> = {
  botsList: [
    { to: '/', label: 'Главная' },
    { label: 'Список ботов' }
  ],
  createIntervalBot: [
    { to: '/', label: 'Главная' },
    { to: '/bots/', label: 'Список ботов' },
    { label: 'Создать' }
  ],
  botDetails: [
    { to: '/', label: 'Главная' },
    { to: '/bots/', label: 'Список ботов' },
    { label: 'Детальная информация' }
  ]
}
