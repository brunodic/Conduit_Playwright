import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  Chip,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../services/api';

interface ExecutionDetail {
  id: string;
  branch: string;
  environment: string;
  suiteTags: string[];
  status: string;
  durationMs: number | null;
  createdAt: string;
  project: {
    id: string;
    name: string;
  };
  metrics: {
    totalTests: number;
    passed: number;
    failed: number;
    skipped: number;
  } | null;
}

export default function ExecutionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [execution, setExecution] = useState<ExecutionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadExecution(id);
    }
  }, [id]);

  const loadExecution = (executionId: string) => {
    api
      .get(`/api/executions/${executionId}`)
      .then((response) => {
        setExecution(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load execution:', error);
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!execution) {
    return (
      <Box>
        <Typography variant="h4">Execução não encontrada</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/executions')}
        sx={{ mb: 2 }}
      >
        Voltar
      </Button>
      <Typography variant="h4" component="h1" gutterBottom>
        Detalhes da Execução
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informações Gerais
            </Typography>
            <Typography>
              <strong>Projeto:</strong> {execution.project.name}
            </Typography>
            <Typography>
              <strong>Branch:</strong> {execution.branch}
            </Typography>
            <Typography>
              <strong>Ambiente:</strong> {execution.environment}
            </Typography>
            <Typography>
              <strong>Status:</strong>{' '}
              <Chip label={execution.status} size="small" />
            </Typography>
            <Typography>
              <strong>Tags:</strong>{' '}
              {execution.suiteTags.map((tag) => (
                <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5 }} />
              ))}
            </Typography>
          </Paper>
        </Grid>
        {execution.metrics && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Métricas
              </Typography>
              <Typography>
                <strong>Total de Testes:</strong> {execution.metrics.totalTests}
              </Typography>
              <Typography color="success.main">
                <strong>Passaram:</strong> {execution.metrics.passed}
              </Typography>
              <Typography color="error.main">
                <strong>Falharam:</strong> {execution.metrics.failed}
              </Typography>
              <Typography>
                <strong>Pulados:</strong> {execution.metrics.skipped}
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

