import React, { useMemo } from 'react'
import { MainToolbar } from '../../components/main-toolbar'
import { Box, Button, CircularProgress, Container, Typography } from '@mui/material'
import { type BotsListDataType, useGetBotsQuery } from '../../services/bots'
import { BotListCard } from './bots-list/bot-card'
import { ErrorAlert } from '../../components/error-alert/error-alert'
import { breadCrumbsConfig } from '../../components/bread-crumbs/config.ts'
import { BreadCrumbsWrapper } from '../../components/bread-crumbs/bread-crumbs-wrapper.tsx'
import IconLoader from '../../components/icon-loader'
import AddIcon from '@mui/icons-material/Add'
import { Link as RouterLink } from 'react-router-dom'

export const BotsList: React.FC = () => {
  const { data, isLoading, error } = useGetBotsQuery()

  const bots = useMemo(() => {
    const result: { active: BotsListDataType[], inactive: BotsListDataType[] } = {
      active: [],
      inactive: []
    }
    data?.forEach((item) => {
      if (item.active) {
        result.active.push(item)
      } else {
        result.inactive.push(item)
      }
    })

    return result
  }, [data])

  return (
    <>
      <MainToolbar />
      <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
        <BreadCrumbsWrapper items={breadCrumbsConfig.botsList} />

        <Typography variant="h1" marginBottom={1}>
          Список роботов
        </Typography>

        {isLoading && <CircularProgress />}

        {bots.active.length === 0 && (
          <Typography variant="body1" marginBottom={1}>
            Активные боты отсутствуют
          </Typography>
        )}
        {bots.active.map((item) => (
          <BotListCard data={item} key={item.id} />
        ))}

        <Box marginTop={4}>
          <Button variant="contained" startIcon={<IconLoader IconClass={AddIcon} />} component={RouterLink} to='/bots/create/interval'>
            Создать
          </Button>
        </Box>

        {bots.inactive.length > 0 && (
          <Box marginTop={4}>

          <Typography variant="h3" marginBottom={1}>
            Неактивные боты
          </Typography>

            {bots.inactive.map((item) => (
              <BotListCard data={item} key={item.id} />
            ))}
          </Box>
        )}

        <ErrorAlert error={error} />
      </Container>
    </>
  )
}
