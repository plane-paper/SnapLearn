import PyPDF2
from typing import List, Dict
from io import BytesIO
import re
import fitz
import google.generativeai as genai
import json
import os
import dotenv

dotenv.load_dotenv()

def extract_text_from_pdf(file_stream):
    file = BytesIO(file_stream)
    reader = PyPDF2.PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

def extract_toc(pdf_bytes):
    """
    Extract TOC - tries embedded first, then uses Gemini
    """
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    
    # Method 1: Try embedded TOC
    toc = doc.get_toc()
    
    if toc:
        return {
            'method': 'embedded',
            'entries': [
                {
                    'level': item[0],
                    'title': item[1],
                    'page': item[2]
                }
                for item in toc
            ]
        }
    
    # Method 2: Use Gemini to extract from text
    print("No embedded TOC found, using Gemini extraction...")
    
    # Extract text from first 20 pages (where TOC usually is)
    toc_text = ""
    max_pages = min(20, len(doc))
    for page_num in range(max_pages):
        toc_text += doc[page_num].get_text()
    
    # Check for Gemini API key
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        return {
            'method': 'error',
            'error': 'No embedded TOC found and GEMINI_API_KEY not set',
            'entries': []
        }
    
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = f"""You are analyzing a textbook PDF. Find and extract the table of contents.

IMPORTANT RULES:
- Only extract entries that are clearly part of the table of contents
- DO NOT extract random sentences with page numbers
- Look for patterns like:
  * "Chapter 1: Title .... 5"
  * "1.1 Section Name .... 12"
  * "Introduction .... 1"
- Include chapter titles, section titles, and major headings
- Assign levels: 1=chapters, 2=sections, 3=subsections

Return ONLY a JSON object with this exact structure (no markdown, no extra text):
{{
  "table_of_contents": [
    {{"title": "Chapter 1: Introduction", "page": 1, "level": 1}},
    {{"title": "Section 1.1: Overview", "page": 3, "level": 2}}
  ]
}}

If no clear table of contents exists, return: {{"table_of_contents": []}}

Text from first {max_pages} pages:
{toc_text[:8000]}"""
        
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith('```'):
            response_text = response_text.split('```')[1]
            if response_text.startswith('json'):
                response_text = response_text[4:]
            response_text = response_text.strip()
        
        result = json.loads(response_text)
        entries = result.get('table_of_contents', [])
        
        return {
            'method': 'gemini',
            'entries': entries,
            'total_entries': len(entries)
        }
        
    except Exception as e:
        return {
            'method': 'error',
            'error': f'Gemini extraction failed: {str(e)}',
            'entries': []
        }

def determine_level(title: str) -> int:
    num_match = re.match(r'^(\d+(?:\.\d+)*)', title)
    if num_match:
        return num_match.group(1).count('.') + 1
    
    if re.match(r'chapter\s+\d+', title, re.IGNORECASE):
        return 1
    
    return 1

def clean_title(title: str) -> str:
    title = re.sub(r'^[\d\.\s:\-]+', '', title)
    title = re.sub(r'\.+$', '', title)
    return title.strip()