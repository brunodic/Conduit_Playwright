// scripts/test-ollama-connection.js
const { checkOllamaConnection } = require('../helpers/ollama-analyzer');

async function testConnection() {
  const ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
  const model = process.env.OLLAMA_MODEL || 'test-analyzer';
  
  console.log('Testando conexão com Ollama...\n');
  console.log(`URL: ${ollamaUrl}`);
  console.log(`Modelo: ${model}\n`);
  
  const result = await checkOllamaConnection(ollamaUrl, model);
  
  if (!result.connected) {
    console.log('Ollama não está acessível!\n');
    console.log('Para iniciar a Ollama, execute em um terminal separado:');
    console.log('   ollama serve\n');
    console.log(`Erro: ${result.error || 'Conexão falhou'}`);
    process.exit(1);
  }
  
  console.log('Ollama está acessível!\n');
  
  if (!result.modelExists) {
    console.log(`Modelo "${model}" não encontrado!\n`);
    console.log('Modelos disponíveis:');
    result.availableModels.forEach(m => console.log(`   - ${m}`));
    console.log(`\nPara baixar o modelo, execute:`);
    console.log(`   ollama pull ${model}`);
    process.exit(1);
  }
  
  console.log(`Modelo "${model}" está disponível!\n`);
  console.log('Tudo pronto! Você pode executar os testes com análise da Ollama.');
  console.log('\nExemplo:');
  console.log('   node scripts/run-tests-with-analysis.js --project=smoke');
}

testConnection().catch(console.error);

