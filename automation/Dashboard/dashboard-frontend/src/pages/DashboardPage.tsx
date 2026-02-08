import { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import api from '../services/api';

interface SummaryMetrics {
  total: number;
  totalTests: number;
  totalPassed: number;
  totalFailed: number;
  totalSkipped: number;
  successRate: number;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<SummaryMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/api/metrics/summary')
      .then((response) => {
        setMetrics(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load metrics:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography color="text.secondary" gutterBottom>
              Total de Execuções
            </Typography>
            <Typography variant="h4">{metrics?.total || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography color="text.secondary" gutterBottom>
              Taxa de Sucesso
            </Typography>
            <Typography variant="h4">
              {metrics?.successRate ? `${metrics.successRate.toFixed(1)}%` : '0%'}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography color="text.secondary" gutterBottom>
              Testes Passaram
            </Typography>
            <Typography variant="h4" color="success.main">
              {metrics?.totalPassed || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography color="text.secondary" gutterBottom>
              Testes Falharam
            </Typography>
            <Typography variant="h4" color="error.main">
              {metrics?.totalFailed || 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

