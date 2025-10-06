import { promises as fs } from "fs";
import path from "path";

interface ProcessedPDF {
  html: string;
  text: string;
}

export async function processPDF(pdfPath: string): Promise<ProcessedPDF> {
  try {
    // Import pdf-parse and handle different module export patterns
    const pdfModule = await import("pdf-parse");
    
    // Try different export patterns: default (production), pdf (dev), or module itself
    const pdf = pdfModule.default || (pdfModule as any).pdf || pdfModule;
    
    if (typeof pdf !== 'function') {
      const availableExports = Object.keys(pdfModule).join(', ');
      throw new Error(`pdf-parse module did not export a callable function. Available exports: ${availableExports}`);
    }
    
    const dataBuffer = await fs.readFile(pdfPath);
    const data = await pdf(dataBuffer);
    
    if (!data || typeof data.text !== 'string') {
      throw new Error('PDF parsing did not return valid text content');
    }
    
    const html = convertTextToHTML(data.text);
    
    return {
      html,
      text: data.text,
    };
  } catch (error) {
    console.error('Error processing PDF:', pdfPath, error);
    throw error;
  }
}

function convertTextToHTML(text: string): string {
  const lines = text.split('\n');
  let html = '<div class="pdf-content">\n';
  let inTable = false;
  let tableRows: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) {
      if (inTable) {
        html += buildTable(tableRows);
        tableRows = [];
        inTable = false;
      }
      html += '<br/>\n';
      continue;
    }
    
    // Detect if line looks like a table row (contains multiple tab-separated or spaced columns)
    const hasMultipleColumns = /\t+|\s{3,}/.test(line);
    
    if (hasMultipleColumns && !inTable) {
      inTable = true;
      tableRows.push(line);
    } else if (hasMultipleColumns && inTable) {
      tableRows.push(line);
    } else {
      if (inTable) {
        html += buildTable(tableRows);
        tableRows = [];
        inTable = false;
      }
      
      // Check if it's a heading (all caps, short line, or ends with colon)
      if (isHeading(line)) {
        html += `<h3 class="text-lg font-semibold mt-6 mb-3">${escapeHtml(line)}</h3>\n`;
      } else if (line.match(/^[\d]+\.|^[•\-\*]/)) {
        // List item
        html += `<p class="ml-4 mb-2">${escapeHtml(line)}</p>\n`;
      } else {
        // Regular paragraph
        html += `<p class="mb-3">${escapeHtml(line)}</p>\n`;
      }
    }
  }
  
  if (inTable && tableRows.length > 0) {
    html += buildTable(tableRows);
  }
  
  html += '</div>';
  return html;
}

function isHeading(line: string): boolean {
  // Heuristics for detecting headings
  if (line.length > 100) return false;
  if (line === line.toUpperCase() && line.length > 3) return true;
  if (line.endsWith(':') && line.length < 50) return true;
  if (/^[\d]+\.[\d]*\s+[A-Z]/.test(line)) return true; // Numbered headings like "1.1 Introduction"
  return false;
}

function buildTable(rows: string[]): string {
  if (rows.length === 0) return '';
  
  let tableHtml = '<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse">\n';
  
  rows.forEach((row, index) => {
    const cells = row.split(/\t+|\s{3,}/);
    const tag = index === 0 ? 'th' : 'td';
    const rowClass = index === 0 ? 'bg-muted' : '';
    
    tableHtml += `<tr class="${rowClass}">\n`;
    cells.forEach(cell => {
      const cellClass = tag === 'th' 
        ? 'border border-border px-4 py-2 text-left font-semibold' 
        : 'border border-border px-4 py-2';
      tableHtml += `<${tag} class="${cellClass}">${escapeHtml(cell.trim())}</${tag}>\n`;
    });
    tableHtml += '</tr>\n';
  });
  
  tableHtml += '</table></div>\n';
  return tableHtml;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

export async function convertAndSavePDF(pdfPath: string): Promise<string> {
  const processed = await processPDF(pdfPath);
  const htmlPath = pdfPath.replace(/\.pdf$/i, '.html');
  
  await fs.writeFile(htmlPath, processed.html, 'utf-8');
  
  return htmlPath;
}
