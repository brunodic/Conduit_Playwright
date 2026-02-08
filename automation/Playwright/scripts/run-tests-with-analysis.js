// scripts/run-tests-with-analysis.js
const { execSync } = require('child_process');
const { enhanceLatestReport } = require('../helpers/enhance-html-report');
const { analyzeLatestErrors } = require('../helpers/analyze-error-attachments');

const args = process.argv.slice(2);
const playwrightArgs = args.length > 0 ? args.join(' ') : '';

(async () => {
  console.log('Executando testes do Playwright...\n');

  const useOllama = process.env.USE_OLLAMA !== 'false'; // Por padrão usa Ollama
  const ollamaModel = process.env.OLLAMA_MODEL || 'test-analyzer';

  try {
    // Executar testes
    execSync(`npx playwright test ${playwrightArgs}`, {
      stdio: 'inherit',
      cwd: process.cwd()
    });

    console.log('\nTestes concluídos!\n');

    // Adicionar análise ao HTML (com Ollama)
    console.log('Adicionando análise ao HTML report...\n');
    await enhanceLatestReport(useOllama, ollamaModel);

    // Analisar attachments de erro
    console.log('\nAnalisando attachments de erro...\n');
    analyzeLatestErrors();

    console.log('\nProcesso completo!');
  } catch (error) {
    // Mesmo com falhas, ainda queremos analisar
    console.log('\nAlguns testes falharam, mas continuando com a análise...\n');
    
    await enhanceLatestReport(useOllama, ollamaModel);
    analyzeLatestErrors();
    
    // Re-throw para manter o exit code de erro
    process.exit(error.status || 1);
  }
})();

