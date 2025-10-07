import { promises as fs } from "fs";
import path from "path";
import mammoth from "mammoth";

interface ProcessedDoc {
  html: string;
}

export async function processDocx(docxPath: string): Promise<ProcessedDoc> {
  try {
    const dataBuffer = await fs.readFile(docxPath);
    
    // Convert DOCX to HTML with mammoth - preserves tables, headings, formatting, and lists
    const result = await mammoth.convertToHtml(
      { buffer: dataBuffer },
      {
        styleMap: [
          // Map Word styles to Tailwind classes for better formatting
          "p[style-name='Heading 1'] => h1.text-2xl.font-bold.mt-8.mb-4",
          "p[style-name='Heading 2'] => h2.text-xl.font-semibold.mt-6.mb-3",
          "p[style-name='Heading 3'] => h3.text-lg.font-semibold.mt-6.mb-3",
          "p[style-name='Heading 4'] => h4.text-base.font-semibold.mt-4.mb-2",
          "p[style-name='Normal'] => p.mb-3",
          // Remove List Paragraph mapping to let mammoth handle lists natively
        ],
      }
    );

    // Wrap in a container div
    const html = `<div class="docx-content">\n${result.value}\n</div>`;
    
    if (result.messages && result.messages.length > 0) {
      console.log('DOCX conversion messages:', result.messages);
    }
    
    return { html };
  } catch (error) {
    console.error('Error processing DOCX:', docxPath, error);
    throw error;
  }
}

export async function convertAndSaveDocx(docxPath: string): Promise<void> {
  try {
    const { html } = await processDocx(docxPath);
    
    // Save HTML file next to the DOCX file
    const htmlPath = docxPath.replace(/\.docx$/i, '.html');
    await fs.writeFile(htmlPath, html, 'utf-8');
    
    console.log(`DOCX converted and saved: ${htmlPath}`);
  } catch (error) {
    console.error('Error converting and saving DOCX:', error);
    throw error;
  }
}
