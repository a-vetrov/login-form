import React, { useMemo } from 'react'
import { useGetBotByIdQuery } from '../../services/bots'
import { useMatch } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { getBotDetailsView } from './details/details-factory'
import { breadCrumbsConfig } from '../../components/bread-crumbs/config.ts'
import { BreadCrumbsWrapper } from '../../components/bread-crumbs/bread-crumbs-wrapper.tsx'
import { useWebsockets } from '../../utils/hooks/use-websockets.ts'

export const BotDetails: React.FC = () => {
  const match = useMatch('/bots/:id')

  const { data, isLoading } = useGetBotByIdQuery(match?.params.id as unknown as string)

  useWebsockets()

  const BotComponent = useMemo(() => {
    if (!data) {
      return null
    }
    return getBotDetailsView(data.type)
  }, [data])

  return (
    <>
      <BreadCrumbsWrapper items={breadCrumbsConfig.botDetails} />
      {isLoading && <CircularProgress />}
      {BotComponent && data && <BotComponent data={data}/>}
    </>
  )
}
