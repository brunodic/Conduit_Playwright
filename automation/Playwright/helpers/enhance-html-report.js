// helpers/enhance-html-report.js
const fs = require('fs');
const path = require('path');
const { analyzeMarkdownFilesWithOllama, generateOllamaAnalysisSection } = require('./ollama-analyzer');

/**
 * Encontra o HTML report mais recente
 */
function findLatestHtmlReport(baseDir = './reports/html-reports') {
  if (!fs.existsSync(baseDir)) {
    return null;
  }

  const dirs = fs.readdirSync(baseDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => ({
      name: dirent.name,
      path: path.join(baseDir, dirent.name),
      time: fs.statSync(path.join(baseDir, dirent.name)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time);

  return dirs.length > 0 ? dirs[0].path : null;
}

/**
 * Analisa arquivos .md (page snapshots) da pasta data
 */
function analyzeMarkdownFiles(dataDir) {
  if (!fs.existsSync(dataDir)) {
    return [];
  }

  const markdownFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.md'));
  const analysis = [];

  for (const file of markdownFiles) {
    try {
      const filePath = path.join(dataDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Extrair informações do snapshot
      const lines = content.split('\n');
      const snapshot = {
        fileName: file,
        filePath: filePath,
        title: lines.find(l => l.startsWith('# '))?.replace('# ', '') || 'Page Snapshot',
        totalLines: lines.length,
        content: content,
        // Extrair elementos importantes
        headings: lines.filter(l => l.match(/^[\s-]*heading/)),
        buttons: lines.filter(l => l.includes('button')),
        links: lines.filter(l => l.includes('link')),
        textboxes: lines.filter(l => l.includes('textbox')),
        errors: lines.filter(l => l.toLowerCase().includes('error') || l.toLowerCase().includes('already exists')),
        // Extrair mensagens de erro específicas
        errorMessages: lines.filter(l => 
          l.includes('already exists') || 
          l.includes('Error') || 
          l.includes('error') ||
          l.includes('invalid') ||
          l.includes('failed')
        ),
      };

      analysis.push(snapshot);
    } catch (e) {
      console.warn(`Erro ao processar ${file}: ${e.message}`);
    }
  }

  return analysis;
}

/**
 * Analisa os dados da pasta data do report
 */
function analyzeReportData(dataDir) {
  if (!fs.existsSync(dataDir)) {
    return { error: 'Pasta data não encontrada' };
  }

  const analysis = {
    totalTests: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    totalDuration: 0,
    errors: [],
    attachments: [],
    projects: {},
    markdownSnapshots: [],
  };

  // Analisar arquivos .md (page snapshots)
  analysis.markdownSnapshots = analyzeMarkdownFiles(dataDir);

  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    try {
      const filePath = path.join(dataDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      // Contar testes
      if (data.status) {
        analysis.totalTests++;
        if (data.status === 'passed') analysis.passed++;
        if (data.status === 'failed') analysis.failed++;
        if (data.status === 'skipped') analysis.skipped++;
      }

      // Duração
      if (data.duration) {
        analysis.totalDuration += data.duration;
      }

      // Projetos
      if (data.projectName) {
        if (!analysis.projects[data.projectName]) {
          analysis.projects[data.projectName] = { passed: 0, failed: 0, skipped: 0 };
        }
        if (data.status === 'passed') analysis.projects[data.projectName].passed++;
        if (data.status === 'failed') analysis.projects[data.projectName].failed++;
        if (data.status === 'skipped') analysis.projects[data.projectName].skipped++;
      }

      // Erros
      if (data.status === 'failed' && data.errors && data.errors.length > 0) {
        for (const error of data.errors) {
          analysis.errors.push({
            test: data.title || file.replace('.json', ''),
            message: error.message || error.text || 'Erro desconhecido',
            location: error.location ? `${error.location.file}:${error.location.line}` : 'N/A',
          });
        }
      }

      // Attachments (especialmente error-context)
      if (data.attachments && Array.isArray(data.attachments)) {
        for (const attachment of data.attachments) {
          if (attachment.name && attachment.name.includes('error')) {
            analysis.attachments.push({
              test: data.title || file.replace('.json', ''),
              name: attachment.name,
              contentType: attachment.contentType || 'text/plain',
              path: attachment.path || attachment.name,
            });
          }
        }
      }
    } catch (e) {
      console.warn(`Erro ao processar ${file}: ${e.message}`);
    }
  }

  return analysis;
}

/**
 * Extrai dados do HTML quando não há arquivos JSON na pasta data
 * O Playwright armazena os dados em arquivos na pasta data/, não no HTML
 * Mas podemos tentar ler os arquivos de teste diretamente
 */
function extractDataFromHtml(htmlPath, existingAnalysis) {
  try {
    const reportDir = path.dirname(htmlPath);
    const dataDir = path.join(reportDir, 'data');
    
    // Se a pasta data existe, tentar ler os arquivos de teste
    if (fs.existsSync(dataDir)) {
      const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
      
      for (const file of files) {
        try {
          const filePath = path.join(dataDir, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const data = JSON.parse(content);
          
          // O Playwright armazena dados de teste em formato específico
          // Verificar se é um arquivo de teste (tem status, title, etc)
          if (data.status || data.outcome) {
            const status = data.status || data.outcome;
            existingAnalysis.totalTests++;
            
            if (status === 'passed' || status === 'expected') {
              existingAnalysis.passed++;
            } else if (status === 'failed' || status === 'unexpected') {
              existingAnalysis.failed++;
            } else if (status === 'skipped') {
              existingAnalysis.skipped++;
            }
            
            if (data.duration) {
              existingAnalysis.totalDuration += data.duration;
            }
            
            // Projetos
            if (data.projectName) {
              if (!existingAnalysis.projects[data.projectName]) {
                existingAnalysis.projects[data.projectName] = { passed: 0, failed: 0, skipped: 0 };
              }
              if (status === 'passed' || status === 'expected') {
                existingAnalysis.projects[data.projectName].passed++;
              } else if (status === 'failed' || status === 'unexpected') {
                existingAnalysis.projects[data.projectName].failed++;
              } else if (status === 'skipped') {
                existingAnalysis.projects[data.projectName].skipped++;
              }
            }
          }
        } catch (e) {
          // Ignorar arquivos que não são de teste
        }
      }
    }
    
  } catch (e) {
    console.warn(`Erro ao extrair dados: ${e.message}`);
  }
  
  return existingAnalysis;
}

/**
 * Gera HTML da seção de análise
 */
function generateAnalysisSection(analysis) {
  // Garantir que todas as propriedades existam
  if (!analysis) {
    analysis = {};
  }
  
  const totalTests = analysis.totalTests || 0;
  const passed = analysis.passed || 0;
  const failed = analysis.failed || 0;
  const skipped = analysis.skipped || 0;
  const totalDuration = analysis.totalDuration || 0;
  const projects = analysis.projects || {};
  const errors = analysis.errors || [];
  const attachments = analysis.attachments || [];
  const markdownSnapshots = analysis.markdownSnapshots || [];

  let html = `
    <div id="error-analysis-section" style="margin: 24px 0; padding: 0;">
      <div class="chip-header" style="margin-top: 12px;">
        <span>Análise Detalhada dos Testes</span>
      </div>
      <div class="chip-body">
        <!-- Estatísticas Gerais -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 24px;">
          <div style="background-color: var(--color-canvas-subtle); padding: 16px; border-radius: 6px; border: 1px solid var(--color-border-default);">
            <div style="font-size: 24px; font-weight: 600; color: var(--color-fg-default);">${totalTests}</div>
            <div style="color: var(--color-fg-muted); margin-top: 4px; font-size: 13px;">Total de Testes</div>
          </div>
          <div style="background-color: var(--color-canvas-subtle); padding: 16px; border-radius: 6px; border: 1px solid var(--color-border-default);">
            <div style="font-size: 24px; font-weight: 600; color: var(--color-success-emphasis);">${passed}</div>
            <div style="color: var(--color-fg-muted); margin-top: 4px; font-size: 13px;">Passou</div>
          </div>
          <div style="background-color: var(--color-canvas-subtle); padding: 16px; border-radius: 6px; border: 1px solid var(--color-border-default);">
            <div style="font-size: 24px; font-weight: 600; color: var(--color-danger-emphasis);">${failed}</div>
            <div style="color: var(--color-fg-muted); margin-top: 4px; font-size: 13px;">Falhou</div>
          </div>
          <div style="background-color: var(--color-canvas-subtle); padding: 16px; border-radius: 6px; border: 1px solid var(--color-border-default);">
            <div style="font-size: 24px; font-weight: 600; color: var(--color-accent-emphasis);">${(totalDuration / 1000).toFixed(2)}s</div>
            <div style="color: var(--color-fg-muted); margin-top: 4px; font-size: 13px;">Duração Total</div>
          </div>
        </div>

      <!-- Por Projeto -->
      ${Object.keys(projects).length > 0 ? `
        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; margin-bottom: 15px;">Por Projeto</h3>
          <div style="background: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f0f0f0;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Projeto</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd; color: #4CAF50;">Passou</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd; color: #f44336;">Falhou</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd; color: #ff9800;">Pulou</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(projects).map(([project, stats]) => `
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${project}</td>
                    <td style="padding: 10px; text-align: center; border-bottom: 1px solid #eee;">${stats.passed}</td>
                    <td style="padding: 10px; text-align: center; border-bottom: 1px solid #eee;">${stats.failed}</td>
                    <td style="padding: 10px; text-align: center; border-bottom: 1px solid #eee;">${stats.skipped}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

      <!-- Erros -->
      ${errors.length > 0 ? `
        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; margin-bottom: 15px;">Erros Encontrados (${errors.length})</h3>
          <div style="background: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            ${errors.slice(0, 10).map(error => `
              <div style="margin-bottom: 15px; padding: 10px; background: #ffebee; border-left: 4px solid #f44336; border-radius: 4px;">
                <div style="font-weight: bold; color: #c62828; margin-bottom: 5px;">${error.test}</div>
                <div style="color: #666; font-size: 14px; margin-bottom: 5px;">${error.message}</div>
                <div style="color: #999; font-size: 12px;">${error.location}</div>
              </div>
            `).join('')}
            ${errors.length > 10 ? `<div style="color: #666; font-style: italic;">... e mais ${errors.length - 10} erro(s)</div>` : ''}
          </div>
        </div>
      ` : ''}

      <!-- Attachments de Erro -->
      ${attachments.length > 0 ? `
        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; margin-bottom: 15px;">Attachments de Erro (${attachments.length})</h3>
          <div style="background: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            ${attachments.map(att => `
              <div style="margin-bottom: 10px; padding: 10px; background: #fff3e0; border-left: 4px solid #ff9800; border-radius: 4px;">
                <div style="font-weight: bold; color: #e65100; margin-bottom: 5px;">${att.test}</div>
                <div style="color: #666; font-size: 14px;">${att.name} (${att.contentType})</div>
                <div style="color: #999; font-size: 12px; margin-top: 5px;">${att.path}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Análise de Page Snapshots (.md) -->
      ${markdownSnapshots.length > 0 ? `
        <div style="margin-bottom: 24px;">
          <h3 style="color: var(--color-fg-default); margin-bottom: 12px; font-size: 16px; font-weight: 600;">Análise de Page Snapshots (${markdownSnapshots.length})</h3>
          <div style="background-color: var(--color-canvas-subtle); padding: 16px; border-radius: 6px; border: 1px solid var(--color-border-default);">
            ${markdownSnapshots.map(snapshot => `
              <div style="margin-bottom: 16px; padding: 16px; background-color: var(--color-canvas-default); border-left: 3px solid var(--color-accent-emphasis); border-radius: 4px;">
                <div style="font-weight: 600; color: var(--color-accent-emphasis); margin-bottom: 8px; font-size: 14px;">
                  ${snapshot.fileName}
                </div>
                <div style="color: var(--color-fg-muted); font-size: 13px; margin-bottom: 12px;">
                  <strong>Título:</strong> ${snapshot.title}
                </div>
                
                <!-- Estatísticas do Snapshot -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 8px; margin-bottom: 12px;">
                  <div style="background-color: var(--color-canvas-subtle); padding: 8px; border-radius: 4px; text-align: center; border: 1px solid var(--color-border-muted);">
                    <div style="font-weight: 600; color: var(--color-accent-emphasis);">${snapshot.headings.length}</div>
                    <div style="font-size: 11px; color: var(--color-fg-muted);">Headings</div>
                  </div>
                  <div style="background-color: var(--color-canvas-subtle); padding: 8px; border-radius: 4px; text-align: center; border: 1px solid var(--color-border-muted);">
                    <div style="font-weight: 600; color: var(--color-success-emphasis);">${snapshot.buttons.length}</div>
                    <div style="font-size: 11px; color: var(--color-fg-muted);">Buttons</div>
                  </div>
                  <div style="background-color: var(--color-canvas-subtle); padding: 8px; border-radius: 4px; text-align: center; border: 1px solid var(--color-border-muted);">
                    <div style="font-weight: 600; color: var(--color-attention-emphasis);">${snapshot.links.length}</div>
                    <div style="font-size: 11px; color: var(--color-fg-muted);">Links</div>
                  </div>
                  <div style="background-color: var(--color-canvas-subtle); padding: 8px; border-radius: 4px; text-align: center; border: 1px solid var(--color-border-muted);">
                    <div style="font-weight: 600; color: var(--color-done-emphasis);">${snapshot.textboxes.length}</div>
                    <div style="font-size: 11px; color: var(--color-fg-muted);">Textboxes</div>
                  </div>
                </div>

                <!-- Mensagens de Erro no Snapshot -->
                ${snapshot.errorMessages.length > 0 ? `
                  <div style="margin-top: 12px; padding: 12px; background-color: var(--color-danger-subtle); border-left: 3px solid var(--color-danger-emphasis); border-radius: 4px;">
                    <div style="font-weight: 600; color: var(--color-danger-emphasis); margin-bottom: 6px; font-size: 13px;">Mensagens de Erro Encontradas:</div>
                    ${snapshot.errorMessages.map(msg => `
                      <div style="color: var(--color-fg-muted); font-size: 12px; margin: 4px 0; padding-left: 8px;">
                        • ${msg.trim()}
                      </div>
                    `).join('')}
                  </div>
                ` : ''}

                <!-- Conteúdo Completo (colapsável) -->
                <details style="margin-top: 12px;">
                  <summary style="cursor: pointer; color: var(--color-accent-emphasis); font-weight: 600; padding: 8px; font-size: 13px;">
                    Ver conteúdo completo do snapshot
                  </summary>
                  <pre style="background-color: var(--color-canvas-subtle); color: var(--color-fg-default); padding: 12px; border-radius: 4px; overflow-x: auto; margin-top: 8px; font-size: 12px; max-height: 400px; overflow-y: auto; border: 1px solid var(--color-border-default); font-family: var(--vscode-editor-font-family, monospace);">${snapshot.content}</pre>
                </details>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  return html;
}

/**
 * Adiciona análise ao HTML report
 */
async function enhanceHtmlReport(reportDir, useOllama = true, ollamaModel = 'test-analyzer') {
  const indexPath = path.join(reportDir, 'index.html');
  const dataDir = path.join(reportDir, 'data');

  if (!fs.existsSync(indexPath)) {
    console.error('index.html não encontrado no report');
    return false;
  }

  // Analisar dados
  console.log('Analisando dados do report...');
  let analysis = analyzeReportData(dataDir);
  
  // Se não houver dados na pasta data, tentar extrair do HTML
  if (analysis.totalTests === 0) {
    analysis = extractDataFromHtml(indexPath, analysis);
  }

  // Analisar com Ollama se solicitado
  let ollamaAnalyses = [];
  if (useOllama && analysis.markdownSnapshots && analysis.markdownSnapshots.length > 0) {
    console.log('Iniciando análise com Ollama...');
    const markdownFiles = analysis.markdownSnapshots.map(s => s.filePath);
    ollamaAnalyses = await analyzeMarkdownFilesWithOllama(markdownFiles, ollamaModel);
    console.log(`Análise da Ollama concluída para ${ollamaAnalyses.length} arquivo(s)`);
  }

  // Ler HTML
  let html = fs.readFileSync(indexPath, 'utf-8');

  // Gerar seção de análise
  const analysisSection = generateAnalysisSection(analysis);
  
  // Gerar seção da Ollama
  const ollamaSection = generateOllamaAnalysisSection(ollamaAnalyses);

  // Combinar seções (análise + Ollama)
  const allSections = analysisSection + (ollamaSection ? '\n' + ollamaSection : '');

  // Inserir antes do fechamento do body ou em uma posição específica
  // Procurar por um ponto de inserção (ex: antes de </body> ou após um elemento específico)
  if (html.includes('</body>')) {
    html = html.replace('</body>', `${allSections}\n</body>`);
  } else if (html.includes('</html>')) {
    html = html.replace('</html>', `${allSections}\n</html>`);
  } else {
    // Adicionar no final
    html += allSections;
  }

  // Salvar HTML modificado
  fs.writeFileSync(indexPath, html, 'utf-8');
  console.log('Análise adicionada ao HTML report!');
  console.log(`Estatísticas: ${analysis.totalTests} testes, ${analysis.passed} passou, ${analysis.failed} falhou`);

  return true;
}

/**
 * Função principal
 */
async function enhanceLatestReport(useOllama = true, ollamaModel = 'test-analyzer') {
  const latestReport = findLatestHtmlReport();

  if (!latestReport) {
    console.log('Nenhum HTML report encontrado em ./reports/html-reports/');
    console.log('Execute os testes primeiro: npx playwright test');
    return;
  }

  console.log(`Report encontrado: ${latestReport}`);
  await enhanceHtmlReport(latestReport, useOllama, ollamaModel);
}

// Exportar funções
module.exports = {
  enhanceHtmlReport,
  enhanceLatestReport,
  findLatestHtmlReport,
  analyzeReportData,
};

// Se executado diretamente
if (require.main === module) {
  enhanceLatestReport();
}

