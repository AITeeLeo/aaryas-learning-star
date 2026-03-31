/* ============================================
   Aarya's Learning Star — PDF Upload
   Extracts text from PDF using PDF.js and
   displays upcoming tests/topics client-side
   ============================================ */

const PdfUpload = (() => {

  // Show status message in the upload area
  function showStatus(message, type) {
    const area = document.getElementById('upload-status-area');
    if (!area) return;
    area.innerHTML = `<div class="upload-status ${type}">${message}</div>`;
  }

  // Extract text from a PDF file using PDF.js
  async function extractTextFromPDF(file) {
    if (typeof pdfjsLib === 'undefined') {
      throw new Error('PDF.js library not loaded. Please check your internet connection and reload.');
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  }

  // Parse extracted text into structured topics/sections
  function parseTopics(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const topics = [];
    let currentSection = null;

    for (const line of lines) {
      // Detect section headers (lines that are short, capitalized, or end with colon)
      const isHeader = (
        (line.length < 80 && /^[A-Z]/.test(line) && !/[.!?]$/.test(line)) ||
        line.endsWith(':') ||
        /^(chapter|unit|lesson|section|test|quiz|review|week)\b/i.test(line) ||
        /^\d+[\.\)]\s/.test(line)
      );

      if (isHeader) {
        currentSection = { title: line.replace(/:$/, ''), items: [] };
        topics.push(currentSection);
      } else if (currentSection) {
        currentSection.items.push(line);
      } else {
        // No section yet — create a general one
        currentSection = { title: 'Study Material', items: [line] };
        topics.push(currentSection);
      }
    }

    return topics;
  }

  // Render extracted content into a readable display
  function renderExtractedContent(topics, rawText) {
    const container = document.getElementById('pdf-content-area');
    if (!container) return;

    let html = '';

    if (topics.length === 0) {
      html = `<div class="pdf-extracted-text"><p>${rawText.substring(0, 2000)}</p></div>`;
    } else {
      html = topics.map(section => {
        const itemsHTML = section.items.length > 0
          ? `<ul class="pdf-topic-list">${section.items.slice(0, 20).map(item =>
              `<li>${item}</li>`
            ).join('')}</ul>`
          : '';
        return `
          <div class="pdf-section">
            <div class="pdf-section-title">${section.title}</div>
            ${itemsHTML}
          </div>
        `;
      }).join('');
    }

    container.innerHTML = `
      <div class="pdf-content-display">
        <div class="pdf-content-header">
          <span style="font-size:1.3rem">📋</span>
          <span style="font-weight:700;color:var(--purple-dark)">Upcoming Tests & Topics</span>
        </div>
        ${html}
      </div>
    `;
  }

  return {
    // Main handler when a file is selected
    async handleFile(file) {
      if (!file) return;

      if (file.type !== 'application/pdf') {
        showStatus('⚠️ Please upload a PDF file.', 'error');
        return;
      }

      try {
        // Step 1: Extract text
        showStatus('📖 Reading PDF...', 'processing');
        const pdfText = await extractTextFromPDF(file);

        if (pdfText.length < 50) {
          showStatus('⚠️ Could not extract enough text from the PDF. It might be an image-based PDF.', 'error');
          return;
        }

        // Step 2: Parse and display content
        const topics = parseTopics(pdfText);
        renderExtractedContent(topics, pdfText);

        // Step 3: Save extracted text for reference
        Storage.setUploadedPdfText(pdfText);
        showStatus('✅ PDF loaded! Topics and content displayed below.', 'success');

      } catch (err) {
        console.error('PDF upload error:', err);
        showStatus(`❌ ${err.message}`, 'error');
      }
    }
  };
})();
