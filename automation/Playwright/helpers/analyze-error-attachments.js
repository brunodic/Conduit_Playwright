// helpers/analyze-error-attachments.js
const fs = require('fs');
const path = require('path');

/**
 * Busca attachments em test-results
 */
function findAttachmentsInTestResults(testResultsDir) {
  const attachments = [];

  if (!fs.existsSync(testResultsDir)) {
    return attachments;
  }

  const testDirs = fs.readdirSync(testResultsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => path.join(testResultsDir, dirent.name));

  for (const testDir of testDirs) {
    const attachmentsDir = path.join(testDir, 'attachments');
    
    if (fs.existsSync(attachmentsDir)) {
      const files = fs.readdirSync(attachmentsDir);
      
      for (const file of files) {
        const filePath = path.join(attachmentsDir, file);
        
        // Buscar arquivos de erro (error-context, screenshots, etc)
        if (file.includes('error') || file.endsWith('.png') || file.endsWith('.txt')) {
          const testName = path.basename(testDir);
          const contentType = file.endsWith('.png') ? 'image/png' : 'text/plain';
          
          let content;
          if (file.endsWith('.txt') || file.endsWith('.log') || file.includes('error')) {
            try {
              content = fs.readFileSync(filePath, 'utf-8');
            } catch (e) {
              content = `[Erro ao ler arquivo: ${e.message}]`;
            }
          }
          
          attachments.push({
            testName,
            filePath,
            fileName: file,
            contentType,
            content,
            screenshotPath: file.endsWith('.png') ? filePath : undefined,
            source: 'test-results',
          });
        }
      }
    }
  }

  return attachments;
}

/**
 * Busca attachments no HTML report (data files)
 */
function findAttachmentsInHtmlReport(htmlReportDir) {
  const attachments = [];
  const dataDir = path.join(htmlReportDir, 'data');

  if (!fs.existsSync(dataDir)) {
    return attachments;
  }

  // Buscar arquivos JSON no data/
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  
  for (const file of files) {
    const filePath = path.join(dataDir, file);
    
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      // Procurar por attachments nos dados do teste
      if (data.attachments && Array.isArray(data.attachments)) {
        for (const attachment of data.attachments) {
          // Buscar especificamente por error-context
          if (attachment.name && attachment.name.includes('error')) {
            // Tentar encontrar o arquivo físico
            const attachmentPath = path.join(htmlReportDir, attachment.path || attachment.name);
            const testResultsPath = path.join('./test-results', attachment.path || attachment.name);
            
            let actualPath = null;
            let content = null;
            
            // Tentar encontrar o arquivo em diferentes locais
            if (fs.existsSync(attachmentPath)) {
              actualPath = attachmentPath;
            } else if (fs.existsSync(testResultsPath)) {
              actualPath = testResultsPath;
            } else {
              // Buscar recursivamente
              actualPath = findFileRecursively(htmlReportDir, attachment.name) ||
                          findFileRecursively('./test-results', attachment.name);
            }
            
            if (actualPath && (actualPath.endsWith('.txt') || actualPath.endsWith('.log'))) {
              try {
                content = fs.readFileSync(actualPath, 'utf-8');
              } catch (e) {
                content = `[Erro ao ler: ${e.message}]`;
              }
            }
            
            attachments.push({
              testName: data.title || data.name || file.replace('.json', ''),
              filePath: actualPath || attachment.path || attachment.name,
              fileName: attachment.name,
              contentType: attachment.contentType || 'text/plain',
              content: content || attachment.body || attachment.text,
              screenshotPath: actualPath && actualPath.endsWith('.png') ? actualPath : undefined,
              source: 'html-report',
            });
          }
        }
      }
    } catch (e) {
      // Ignorar arquivos JSON inválidos
      console.warn(`Erro ao processar ${file}: ${e.message}`);
    }
  }

  return attachments;
}

/**
 * Busca arquivo recursivamente
 */
function findFileRecursively(dir, fileName) {
  if (!fs.existsSync(dir)) return null;
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      const found = findFileRecursively(filePath, fileName);
      if (found) return found;
    } else if (file === fileName || file.includes(fileName)) {
      return filePath;
    }
  }
  
  return null;
}

/**
 * Analisa attachments de erro do Playwright
 * Procura em test-results/ e no HTML report
 */
function analyzeErrorAttachments(
  testResultsDir = './test-results',
  htmlReportDir = './playwright-report'
) {
  const attachments = [];
  
  // 1. Buscar em test-results
  const testResultsAttachments = findAttachmentsInTestResults(testResultsDir);
  attachments.push(...testResultsAttachments);
  
  // 2. Buscar no HTML report
  const htmlReportAttachments = findAttachmentsInHtmlReport(htmlReportDir);
  attachments.push(...htmlReportAttachments);
  
  // Remover duplicatas (mesmo arquivo encontrado em ambos os lugares)
  const uniqueAttachments = [];
  const seen = new Set();
  
  for (const att of attachments) {
    const key = `${att.testName}-${att.fileName || att.filePath}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueAttachments.push(att);
    }
  }
  
  return uniqueAttachments;
}

/**
 * Gera um relatório de análise dos erros encontrados
 */
function generateErrorAnalysisReport(attachments) {
  if (attachments.length === 0) {
    return 'Nenhum attachment de erro encontrado.';
  }

  let report = `# Análise de Erros - ${new Date().toLocaleString()}\n\n`;
  report += `Total de attachments encontrados: ${attachments.length}\n\n`;

  for (const attachment of attachments) {
    report += `## Teste: ${attachment.testName}\n`;
    report += `- Arquivo: ${attachment.fileName || attachment.filePath}\n`;
    report += `- Caminho: ${attachment.filePath}\n`;
    report += `- Tipo: ${attachment.contentType}\n`;
    report += `- Fonte: ${attachment.source || 'desconhecida'}\n`;

    if (attachment.content) {
      report += `\n### Conteúdo do erro:\n\`\`\`\n${attachment.content}\n\`\`\`\n`;
    }

    if (attachment.screenshotPath) {
      report += `- Screenshot: ${attachment.screenshotPath}\n`;
    }

    report += `\n---\n\n`;
  }

  return report;
}

/**
 * Função principal para análise automática
 */
function analyzeLatestErrors() {
  try {
    console.log('Buscando attachments de erro...\n');
    const attachments = analyzeErrorAttachments();
    const report = generateErrorAnalysisReport(attachments);
    
    // Salvar relatório
    const reportPath = path.join('./reports', `error-analysis-${Date.now()}.md`);
    if (!fs.existsSync('./reports')) {
      fs.mkdirSync('./reports', { recursive: true });
    }
    fs.writeFileSync(reportPath, report, 'utf-8');
    
    console.log('Análise de erros concluída!');
    console.log(`Relatório salvo em: ${reportPath}`);
    console.log(`\n${report}`);
  } catch (error) {
    console.error('Erro ao analisar attachments:', error);
    console.error(error.stack);
  }
}

// Exportar funções para uso externo
module.exports = {
  analyzeErrorAttachments,
  generateErrorAnalysisReport,
  analyzeLatestErrors,
};

// Se executado diretamente
if (require.main === module) {
  analyzeLatestErrors();
}