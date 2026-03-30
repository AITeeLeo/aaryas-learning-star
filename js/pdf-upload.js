/* ============================================
   Aarya's Learning Star — PDF Upload & Claude API
   Extracts text from PDF using PDF.js, then
   sends to Claude API to generate quiz questions
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

  // Call Claude API to generate quiz questions from extracted text
  async function generateQuestions(pdfText) {
    const apiKey = Storage.getAPIKey();
    if (!apiKey) {
      throw new Error('Please enter your Claude API key in the settings above.');
    }

    const systemPrompt = `You are a helpful educational assistant creating quiz questions for Aarya, an 8-9 year old girl in Grade 3-4 following the Abeka curriculum. Generate quiz questions based STRICTLY on the content provided. Questions should be age-appropriate, clear, and encouraging.`;

    const userPrompt = `Based on the following study material, generate 10-15 quiz questions for an 8-9 year old student.

IMPORTANT: Return ONLY valid JSON — no markdown, no code fences, no extra text. Return a JSON array of question objects with this exact format:

[
  {
    "id": "w1",
    "type": "multiple-choice",
    "difficulty": "easy",
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option B",
    "explanation": "Kid-friendly explanation here."
  },
  {
    "id": "w2",
    "type": "true-false",
    "difficulty": "medium",
    "question": "Statement here.",
    "options": ["True", "False"],
    "answer": "True",
    "explanation": "Kid-friendly explanation here."
  },
  {
    "id": "w3",
    "type": "fill-blank",
    "difficulty": "medium",
    "question": "The answer is ____.",
    "answer": "word",
    "explanation": "Kid-friendly explanation here."
  }
]

Rules:
- Mix question types: use multiple-choice, true-false, AND fill-in-the-blank
- Mix difficulties: include easy, medium, and hard questions
- For fill-blank, the answer should be a single word or short phrase
- Keep language simple and encouraging
- Explanations should be brief and help the child learn
- Questions must be based on the provided content only
- Each question needs a unique id starting with "w" (w1, w2, w3, etc.)

Study material:
${pdfText}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    // Parse JSON from response (handle potential markdown code fences)
    let jsonStr = text;
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) jsonStr = fenceMatch[1];

    const questions = JSON.parse(jsonStr.trim());

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('No questions were generated. Please try a different PDF.');
    }

    return questions;
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

        // Step 2: Generate questions via Claude
        showStatus('🤖 Generating quiz questions with AI...', 'processing');
        const questions = await generateQuestions(pdfText);

        // Step 3: Save to localStorage
        Storage.setWeeklyQuestions(questions);
        showStatus(`✅ Generated ${questions.length} questions! Aarya will see "This Week's Test" on her home screen.`, 'success');

      } catch (err) {
        console.error('PDF upload error:', err);
        showStatus(`❌ ${err.message}`, 'error');
      }
    }
  };
})();
