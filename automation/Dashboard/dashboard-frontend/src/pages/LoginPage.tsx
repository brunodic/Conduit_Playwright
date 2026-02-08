import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Check if we have a token from OAuth callback
    const token = searchParams.get('token');
    if (token) {
      // Get user info and set auth
      api
        .get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setAuth(response.data, token);
          navigate('/');
        })
        .catch((error) => {
          console.error('Failed to authenticate:', error);
        });
    }

    // If already authenticated, redirect to dashboard
    if (isAuthenticated && !token) {
      navigate('/');
    }
  }, [searchParams, setAuth, navigate, isAuthenticated]);

  const handleGitHubLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/github`;
  };

  if (searchParams.get('token')) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Autenticando...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Test Automation Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Faça login com sua conta GitHub para continuar
          </Typography>
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<GitHubIcon />}
            onClick={handleGitHubLogin}
            sx={{ mt: 2 }}
          >
            Entrar com GitHub
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}

