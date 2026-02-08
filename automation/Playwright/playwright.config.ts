import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  
  // Configurações gerais
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Configurar reporter HTML com pasta customizada e timestamp
  reporter: [
    ['html', { 
      outputFolder: `./reports/html-reports/${new Date().toISOString().split('T')[0]}-${Date.now()}`,
      open: 'never' // Não abrir automaticamente
    }]
  ],
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // ===== TAGS POR TIPO DE TESTE =====
    {
      name: 'ui',
      grep: /@ui/,
    },
    {
      name: 'api',
      grep: /@api/,
    },
    {
      name: 'e2e',
      grep: /@e2e/,
    },
    {
      name: 'integration',
      grep: /@integration/,
    },
    {
      name: 'unit',
      grep: /@unit/,
    },
    {
      name: 'performance',
      grep: /@performance/,
    },
    {
      name: 'security',
      grep: /@security/,
    },
    {
      name: 'accessibility',
      grep: /@accessibility/,
    },

    // ===== TAGS POR RISCO/PRIORIDADE =====
    {
      name: 'high',
      grep: /@high/,
    },
    {
      name: 'medium',
      grep: /@medium/,
    },
    {
      name: 'low',
      grep: /@low/,
    },
    {
      name: 'risk',
      grep: /@risk/,
    },
    {
      name: 'businessCritical',
      grep: /@businessCritical/,
    },

    // ===== TAGS GERAIS =====
    {
      name: 'smoke',
      grep: /@smoke/,
    },
    {
      name: 'regression',
      grep: /@regression/,
    },
    {
      name: 'critical',
      grep: /@critical/,
    },

    // ===== PROJETOS COMBINADOS (exemplos úteis) =====
    {
      name: 'smoke-ui',
      grep: /@smoke.*@ui|@ui.*@smoke/,
    },
    {
      name: 'critical-high',
      grep: /@critical.*@high|@high.*@critical/,
    },
    {
      name: 'e2e-critical',
      grep: /@e2e.*@critical|@critical.*@e2e/,
    },
  ],
});

