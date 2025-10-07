import { promises as fs } from "fs";
import path from "path";
import mammoth from "mammoth";

interface ProcessedDoc {
  html: string;
}

function moveReferencesToEnd(html: string): string {
  // Find References section and move it to the end
  const headingPattern = /<(h[1-6])[^>]*>(.*?)<\/\1>/gi;
  const headings: Array<{ tag: string; level: number; content: string; index: number; fullMatch: string }> = [];
  
  let match;
  while ((match = headingPattern.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    const level = parseInt(tag.charAt(1));
    const content = match[2].replace(/<[^>]*>/g, '').trim();
    headings.push({
      tag,
      level,
      content,
      index: match.index,
      fullMatch: match[0]
    });
  }
  
  // Find the References heading (case-insensitive)
  const refIndex = headings.findIndex(h => /^references?$/i.test(h.content));
  
  if (refIndex === -1) {
    return html; // No References section found
  }
  
  const refHeading = headings[refIndex];
  const refLevel = refHeading.level;
  
  // Find where the References section ends (next heading of same or higher level)
  let endIndex = html.length;
  for (let i = refIndex + 1; i < headings.length; i++) {
    if (headings[i].level <= refLevel) {
      endIndex = headings[i].index;
      break;
    }
  }
  
  // Extract the References section
  const referencesSection = html.substring(refHeading.index, endIndex);
  
  // Remove it from current position
  const htmlWithoutRefs = html.substring(0, refHeading.index) + html.substring(endIndex);
  
  // Append References at the very end (trim trailing whitespace first)
  return htmlWithoutRefs.trimEnd() + '\n' + referencesSection;
}

export async function processDocx(docxPath: string): Promise<ProcessedDoc> {
  try {
    const dataBuffer = await fs.readFile(docxPath);
    
    // Convert DOCX to HTML with mammoth - preserves tables, headings, formatting
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
          "p[style-name='List Paragraph'] => p.ml-4.mb-2",
        ],
      }
    );

    // Move References section to the end if present
    const processedHtml = moveReferencesToEnd(result.value);
    
    // Wrap in a container div
    const html = `<div class="docx-content">\n${processedHtml}\n</div>`;
    
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
