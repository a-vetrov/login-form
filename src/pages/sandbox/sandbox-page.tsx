import React from 'react';
import {MainToolbar} from "../../components/main-toolbar";
import { Container, Typography } from '@mui/material';
import {sandboxApi} from "../../services/sandbox.ts";

export const SandboxPage: React.FC = () => {
  const accounts = sandboxApi.useGetAccountsQuery()

  console.log('Data!!!!', accounts)

  return (
    <>
      <MainToolbar />
      <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h2">
          Песочница
        </Typography>
        <Typography variant="body1">
          Здесь можно управлять виртуальными брокерскими счетами без проведения операций по реальной покупке/продаже продуктов.
        </Typography>
      </Container>
    </>
  );
};
