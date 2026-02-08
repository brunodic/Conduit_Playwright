// scripts/diagnose-ollama.js
const { execSync } = require('child_process');

console.log('Diagnóstico completo da Ollama...\n');

// Testar diferentes URLs/portas comuns
const urlsToTest = [
  'http://localhost:11434',
  'http://127.0.0.1:11434',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
];

async function testUrl(url) {
  try {
    const response = await fetch(`${url}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000),
    });
    if (response.ok) {
      const data = await response.json();
      return { success: true, url, models: data.models || [] };
    }
    return { success: false, url, error: `HTTP ${response.status}` };
  } catch (error) {
    return { success: false, url, error: error.message };
  }
}

async function diagnose() {
  console.log('1. Verificando processos Ollama...\n');
  
  try {
    // Windows: verificar processos
    const processes = execSync('tasklist /FI "IMAGENAME eq ollama.exe"', { encoding: 'utf-8' });
    if (processes.includes('ollama.exe')) {
      console.log('Processo ollama.exe encontrado rodando\n');
    } else {
      console.log('Processo ollama.exe NÃO encontrado\n');
      console.log('Tente iniciar manualmente: ollama serve\n');
    }
  } catch (e) {
    console.log('Não foi possível verificar processos\n');
  }

  console.log('2. Testando conexão em diferentes URLs...\n');
  
  const results = [];
  for (const url of urlsToTest) {
    console.log(`   Testando ${url}...`);
    const result = await testUrl(url);
    results.push(result);
    
    if (result.success) {
      console.log(`   CONECTADO! Modelos disponíveis: ${result.models.length}\n`);
      if (result.models.length > 0) {
        console.log('   Modelos:');
        result.models.forEach(m => {
          console.log(`      - ${m.name} (${(m.size / 1024 / 1024 / 1024).toFixed(2)} GB)`);
        });
        console.log('');
      }
    } else {
      console.log(`   Falhou: ${result.error}\n`);
    }
  }

  const workingUrl = results.find(r => r.success);
  
  if (workingUrl) {
    console.log('Ollama está acessível!\n');
    console.log(`URL funcionando: ${workingUrl.url}\n`);
    console.log('Para usar esta URL, defina a variável de ambiente:');
    console.log(`   $env:OLLAMA_URL="${workingUrl.url}"\n`);
    console.log('   Ou edite os arquivos para usar esta URL como padrão.\n');
  } else {
    console.log('Ollama não está acessível em nenhuma das URLs testadas!\n');
    console.log('Possíveis soluções:\n');
    console.log('   1. Verifique se o Ollama está realmente rodando:');
    console.log('      - Abra o Gerenciador de Tarefas e procure por "ollama.exe"');
    console.log('      - Ou execute: tasklist | findstr ollama\n');
    console.log('   2. Verifique a porta:');
    console.log('      - O Ollama pode estar em outra porta');
    console.log('      - Verifique as configurações do Ollama\n');
    console.log('   3. Verifique firewall/antivírus:');
    console.log('      - Pode estar bloqueando a conexão localhost\n');
    console.log('   4. Tente reiniciar o Ollama:');
    console.log('      - Feche todos os processos ollama.exe');
    console.log('      - Execute novamente: ollama serve\n');
    console.log('   5. Verifique se o Ollama está instalado corretamente:');
    console.log('      - Execute: ollama --version\n');
  }

  // Verificar variável de ambiente
  console.log('3. Variáveis de ambiente:\n');
  const envUrl = process.env.OLLAMA_URL;
  if (envUrl) {
    console.log(`   OLLAMA_URL=${envUrl}`);
    const envResult = await testUrl(envUrl);
    if (envResult.success) {
      console.log(`   URL da variável de ambiente está funcionando!\n`);
    } else {
      console.log(`   URL da variável de ambiente NÃO está funcionando: ${envResult.error}\n`);
    }
  } else {
    console.log('   OLLAMA_URL não está definida (usando padrão: http://localhost:11434)\n');
  }
}

diagnose().catch(console.error);

