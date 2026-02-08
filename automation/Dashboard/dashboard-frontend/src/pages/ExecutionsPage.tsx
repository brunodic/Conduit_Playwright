import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import api from '../services/api';

interface Execution {
  id: string;
  branch: string;
  environment: string;
  status: string;
  durationMs: number | null;
  createdAt: string;
  project: {
    id: string;
    name: string;
  };
  triggeredByUser: {
    email: string;
    name: string | null;
  };
}

export default function ExecutionsPage() {
  const navigate = useNavigate();
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExecutions();
  }, []);

  const loadExecutions = () => {
    api
      .get('/api/executions')
      .then((response) => {
        setExecutions(response.data.executions || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load executions:', error);
        setLoading(false);
      });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASSED':
        return 'success';
      case 'FAILED':
        return 'error';
      case 'RUNNING':
        return 'info';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDuration = (ms: number | null) => {
    if (!ms) return '-';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Execuções
        </Typography>
        <Button variant="contained" startIcon={<PlayArrowIcon />}>
          Nova Execução
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Projeto</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Ambiente</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Duração</TableCell>
              <TableCell>Iniciado Por</TableCell>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {executions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary">
                    Nenhuma execução encontrada
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              executions.map((execution) => (
                <TableRow
                  key={execution.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/executions/${execution.id}`)}
                >
                  <TableCell>{execution.project.name}</TableCell>
                  <TableCell>{execution.branch}</TableCell>
                  <TableCell>{execution.environment}</TableCell>
                  <TableCell>
                    <Chip
                      label={execution.status}
                      color={getStatusColor(execution.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDuration(execution.durationMs)}</TableCell>
                  <TableCell>
                    {execution.triggeredByUser.name || execution.triggeredByUser.email}
                  </TableCell>
                  <TableCell>
                    {new Date(execution.createdAt).toLocaleString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

