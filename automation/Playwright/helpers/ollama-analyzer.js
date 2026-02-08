// helpers/ollama-analyzer.js
const fs = require('fs');
const path = require('path');

/**
 * Verifica se a Ollama está acessível e se o modelo existe
 */
async function checkOllamaConnection(ollamaUrl = 'http://127.0.0.1:11434', model = 'llama3:latest') {
  try {
    const response = await fetch(`${ollamaUrl}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // Timeout de 5 segundos
    });
    
    if (!response.ok) {
      return { connected: false, error: `HTTP ${response.status}` };
    }
    
    const data = await response.json();
    const models = data.models || [];
    const modelExists = models.some(m => m.name === model || m.name.startsWith(model.split(':')[0]));
    
    return {
      connected: true,
      modelExists: modelExists,
      availableModels: models.map(m => m.name),
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
    };
  }
}

/**
 * Chama a API da Ollama para analisar conteúdo
 */
async function callOllama(model = 'test-analyzer', prompt, content = '') {
  const ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
  // Com modelo customizado, o prompt já inclui tudo que precisa
  const fullPrompt = prompt;

  // Verificar conexão primeiro
  const connectionCheck = await checkOllamaConnection(ollamaUrl, model);
  if (!connectionCheck.connected) {
    const errorMsg = `Ollama não está acessível em ${ollamaUrl}.\n\nPara iniciar a Ollama, execute em um terminal separado:\n   ollama serve\n\nErro: ${connectionCheck.error || 'Conexão falhou'}`;
    console.error(errorMsg);
    return `Erro: ${errorMsg}`;
  }
  
  if (!connectionCheck.modelExists) {
    const availableModels = connectionCheck.availableModels.join(', ') || 'nenhum';
    const errorMsg = `Modelo "${model}" não encontrado na Ollama.\n\nModelos disponíveis: ${availableModels}\n\nPara baixar o modelo, execute:\n   ollama pull ${model}`;
    console.error(errorMsg);
    return `Erro: ${errorMsg}`;
  }
  
  console.log(`Ollama conectada e modelo "${model}" disponível`);

  try {
    console.log(`   📤 Enviando requisição para Ollama (tamanho do prompt: ${fullPrompt.length} caracteres)...`);
    
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 2000, // Limitar resposta a ~2000 tokens
        },
      }),
      signal: AbortSignal.timeout(300000), // Timeout de 5 minutos para análise
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.response || data.text || 'Análise não disponível';
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`Timeout ao chamar Ollama (análise demorou mais de 5 minutos)`);
      console.error(`Dicas:`);
      console.error(`   - A análise pode estar demorando muito`);
      console.error(`   - Tente usar um modelo mais rápido (ex: mistral)`);
      console.error(`   - Ou reduza o tamanho do conteúdo analisado`);
      return `Timeout: A análise demorou mais de 5 minutos. Isso pode acontecer com modelos grandes ou conteúdo muito extenso. Tente usar um modelo mais rápido ou aguarde mais tempo.`;
    }
    console.error(`Erro ao chamar Ollama: ${error.message}`);
    console.error(`Dica: Verifique se a Ollama está rodando: ollama serve`);
    return `Erro ao analisar: ${error.message}`;
  }
}

/**
 * Gera prompt simplificado (o system prompt já está no modelo customizado)
 */
function generateSnapshotAnalysisPrompt(fileName, content) {
  // Prompt muito mais curto - só pede análise do conteúdo específico
  return `Analise o seguinte page snapshot do arquivo "${fileName}":

\`\`\`
${content}
\`\`\`

Forneça uma análise técnica detalhada seguindo o formato especificado.`;
}

/**
 * Analisa um arquivo .md usando Ollama
 */
async function analyzeMarkdownFileWithOllama(filePath, model = 'test-analyzer') {
  const fileName = path.basename(filePath);
  console.log(`Analisando ${fileName} com Ollama (modelo: ${model})...`);

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const prompt = generateSnapshotAnalysisPrompt(fileName, content);
    
    // Com modelo customizado, enviamos apenas o prompt (que já inclui o conteúdo)
    const analysis = await callOllama(model, prompt, '');
    
    // Verificar se a análise foi bem-sucedida (não começa com "Erro:")
    const success = !analysis.startsWith('Erro:');
    
    if (success) {
      console.log(`Análise concluída para ${fileName}`);
    } else {
      console.log(analysis);
    }
    
    return {
      fileName,
      filePath,
      analysis,
      success: success,
    };
  } catch (error) {
    console.error(`Erro ao analisar ${fileName}: ${error.message}`);
    return {
      fileName,
      filePath,
      analysis: `Erro ao analisar: ${error.message}`,
      success: false,
    };
  }
}

/**
 * Analisa múltiplos arquivos .md
 */
async function analyzeMarkdownFilesWithOllama(markdownFiles, model = 'test-analyzer') {
  const analyses = [];

  for (const file of markdownFiles) {
    const result = await analyzeMarkdownFileWithOllama(file, model);
    analyses.push(result);
    
    // Pequeno delay para não sobrecarregar a API
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return analyses;
}

/**
 * Gera HTML da seção de análise da Ollama
 */
function generateOllamaAnalysisSection(analyses) {
  if (!analyses || analyses.length === 0) {
    return '';
  }

  let html = `
    <div id="ollama-analysis-section" style="margin: 24px 0; padding: 0;">
      <div class="chip-header" style="margin-top: 12px;">
        <span>Análise com IA (Ollama)</span>
      </div>
      <div class="chip-body">
        ${analyses.map((analysis, index) => `
          <div style="margin-bottom: ${index < analyses.length - 1 ? '24px' : '0'}; padding-bottom: ${index < analyses.length - 1 ? '24px' : '0'}; border-bottom: ${index < analyses.length - 1 ? '1px solid var(--color-border-default)' : 'none'};">
            <div style="display: flex; align-items: center; margin-bottom: 12px; gap: 8px;">
              <span style="font-size: 18px; color: ${analysis.success ? 'var(--color-success-emphasis)' : 'var(--color-danger-emphasis)'};">
                ${analysis.success ? '✓' : '✗'}
              </span>
              <h3 style="color: var(--color-fg-default); margin: 0; font-size: 16px; font-weight: 600;">
                ${analysis.fileName}
              </h3>
            </div>
            
            <div style="background-color: var(--color-canvas-subtle); padding: 16px; border-radius: 6px; border-left: 3px solid ${analysis.success ? 'var(--color-success-emphasis)' : 'var(--color-danger-emphasis)'};">
              <div style="color: var(--color-fg-default); line-height: 1.6; font-size: 14px; font-family: var(--vscode-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif);">
                ${formatMarkdownToHtml(analysis.analysis)}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  return html;
}

/**
 * Converte Markdown básico para HTML usando estilos do Playwright
 */
function formatMarkdownToHtml(markdown) {
  if (!markdown) return '';
  
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3 style="color: var(--color-fg-default); margin-top: 16px; margin-bottom: 8px; font-size: 16px; font-weight: 600;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="color: var(--color-fg-default); margin-top: 20px; margin-bottom: 12px; font-size: 18px; font-weight: 600;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="color: var(--color-fg-default); margin-top: 24px; margin-bottom: 16px; font-size: 20px; font-weight: 600;">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--color-fg-default); font-weight: 600;">$1</strong>')
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre style="background-color: var(--color-canvas-subtle); padding: 12px; border-radius: 6px; overflow-x: auto; border: 1px solid var(--color-border-default); margin: 12px 0;"><code style="font-family: var(--vscode-editor-font-family, monospace); font-size: 13px; color: var(--color-fg-default);">$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code style="background-color: var(--color-canvas-subtle); padding: 2px 6px; border-radius: 4px; font-family: var(--vscode-editor-font-family, monospace); font-size: 13px; color: var(--color-fg-default); border: 1px solid var(--color-border-muted);">$1</code>')
    // Lists
    .replace(/^\* (.*$)/gim, '<li style="margin: 6px 0; color: var(--color-fg-default);">$1</li>')
    .replace(/^- (.*$)/gim, '<li style="margin: 6px 0; color: var(--color-fg-default);">$1</li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li style="margin: 6px 0; color: var(--color-fg-default);">$2</li>')
    // Line breaks
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
  
  // Wrap lists in ul tags
  html = html.replace(/(<li[^>]*>.*<\/li>)/g, (match) => {
    if (!match.includes('<ul')) {
      return `<ul style="margin: 12px 0; padding-left: 24px; color: var(--color-fg-default);">${match}</ul>`;
    }
    return match;
  });
  
  return html;
}

module.exports = {
  callOllama,
  checkOllamaConnection,
  analyzeMarkdownFileWithOllama,
  analyzeMarkdownFilesWithOllama,
  generateOllamaAnalysisSection,
  generateSnapshotAnalysisPrompt,
};

