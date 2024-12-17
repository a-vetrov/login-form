import React from 'react';
import {useGetBotOrdersQuery} from '../../../services/bots';
import {Typography} from '@mui/material';

interface Props {
  id: string
}

export const BotOrders: React.FC<Props> = ({id}) => {
  const {data, error} = useGetBotOrdersQuery(id)
  return (
    <>
      <Typography variant="h2" marginBottom={1}>
        Список ордеров
      </Typography>

    </>
  );
};
