import React from 'react'
import { MainToolbar } from '../../components/main-toolbar'
import { useGetBrokerListQuery } from '../../services/broker'

export const BrokerListPage: React.FC = () => {
  const { data, error, isLoading } = useGetBrokerListQuery()

  console.log({ data, error, isLoading })

  return (
    <>
      <MainToolbar />
      <h1>Список брокеров</h1>
    </>
  )
}
