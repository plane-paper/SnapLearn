from typing import List, Dict
import re
import dotenv
import google.generativeai as genai
import os
dotenv.load_dotenv()

def extract_chapter_info(title: str) -> Dict:
    try:
        is_shortened = "(shortened)" in title.lower()
        part_match = re.search(r'\(Part (\d+)\)', title, re.IGNORECASE)
        part_number = int(part_match.group(1)) if part_match else None
        base_title = title
        base_title = re.sub(r'\s*\(shortened\)\s*', '', base_title, flags=re.IGNORECASE)
        base_title = re.sub(r'\s*\(Part \d+\)\s*', '', base_title, flags=re.IGNORECASE)
        base_title = base_title.strip()
        is_multi_chapter = " and " in base_title.lower() or ", chapter" in base_title.lower()
        return {
            "base_title": base_title,
            "is_shortened": is_shortened,
            "part_number": part_number,
            "is_multi_chapter": is_multi_chapter
        }
    except Exception as e:
        print(f"Error in extract_chapter_info: {e}")
        return {
            "base_title": title,
            "is_shortened": False,
            "part_number": None,
            "is_multi_chapter": False
        }

def count_chapter_parts(lesson_list: List[List[Dict]], chapter_base_title: str) -> int:
    try:
        part_numbers = []
        for lesson in lesson_list:
            for topic in lesson:
                if topic.get("type") == "practice":
                    continue
                info = extract_chapter_info(topic["title"])
                if info["base_title"] == chapter_base_title and info["part_number"] is not None:
                    part_numbers.append(info["part_number"])
        return max(part_numbers) if part_numbers else 1
    except Exception as e:
        print(f"Error in count_chapter_parts: {e}")
        return 1

def extract_chapter_text(pdf_bytes: bytes, chapter_title: str, toc: Dict) -> str:
    """
    Extracts text from the PDF for the specified chapter using TOC.
    
    Args:
        pdf_bytes: PDF file as bytes
        chapter_title: Title of the chapter to extract
        toc: Table of contents dictionary from extract_toc() with 'entries' key
    
    Returns:
        Extracted text from the chapter
    """
    try:
        import fitz  # PyMuPDF
        
        # Get the entries list from the TOC dictionary
        entries = toc.get('entries', [])
        
        # Find the chapter in TOC
        chapter_entry = None
        chapter_index = None
        
        for idx, entry in enumerate(entries):
            if entry["title"].strip().lower() == chapter_title.strip().lower():
                chapter_entry = entry
                chapter_index = idx
                break
        
        if not chapter_entry:
            return f"[Chapter '{chapter_title}' not found in TOC]"
        
        # Determine end page (start of next chapter or end of document)
        start_page = chapter_entry["page"]
        if chapter_index + 1 < len(entries):
            end_page = entries[chapter_index + 1]["page"]
        else:
            # Last chapter - read to end of document
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            end_page = len(doc)
            doc.close()
        
        # Extract text from the page range
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        chapter_text = ""
        
        for page_num in range(start_page, end_page):
            if page_num < len(doc):
                page = doc[page_num]
                chapter_text += page.get_text()
        
        doc.close()
        return chapter_text
    except Exception as e:
        print(f"Error in extract_chapter_text: {e}")
        import traceback
        traceback.print_exc()
        return f"[Error extracting text for chapter '{chapter_title}']"

def create_gemini_prompt(chapter_info: Dict, chapter_text: str, target_time: int, 
                         total_parts: int = None) -> str:
    try:
        base_prompt = f"The following is content from a chapter:\n\n{chapter_text}\n\n"
        if chapter_info["part_number"] is not None:
            part_num = chapter_info["part_number"]
            prompt = base_prompt + (
                f"This chapter needs to be split into {total_parts} equal parts. "
                f"Please summarize only part {part_num} of {total_parts} "
                f"(from approximately {(part_num-1)/total_parts*100:.0f}% to {part_num/total_parts*100:.0f}% through the chapter). "
                f"The summary should take approximately {target_time} minutes to read. "
                f"Focus on the key concepts and information from this section of the chapter."
            )
        elif chapter_info["is_shortened"]:
            prompt = base_prompt + (
                f"Please create a shortened summary of this chapter that takes approximately {target_time} minutes to read. "
                f"Focus on the most important and relevant concepts. Leave out less relevant details and examples. "
                f"Prioritize core ideas that are essential to understanding the main points."
            )
        elif chapter_info["is_multi_chapter"]:
            prompt = base_prompt + (
                f"Please summarize these chapters together into a cohesive lesson that takes approximately {target_time} minutes to read. "
                f"Combine related concepts and show connections between the chapters while covering all key points."
            )
        else:
            prompt = base_prompt + (
                f"Please summarize this entire chapter in a way that takes approximately {target_time} minutes to read. "
                f"Cover all major concepts, key points, and important details while maintaining a clear narrative flow."
            )
        return prompt
    except Exception as e:
        print(f"Error in create_gemini_prompt: {e}")
        return "Error creating prompt."

def call_gemini(prompt: str) -> str:
    try:
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        if response_text.startswith('```'):
            response_text = response_text.split('```')[1]
            if response_text.startswith('json'):
                response_text = response_text[4:]
            response_text = response_text.strip()
        return response_text
    except Exception as e:
        print(f"Error in call_gemini: {e}")
        return "[Error generating content]"

def generate_lesson_content(pdf_bytes: bytes, lesson_list: List[List[Dict]], toc: Dict) -> List[Dict]:
    try:
        generated_lessons = []
        for lesson_idx, lesson in enumerate(lesson_list):
            lesson_content = []
            for topic in lesson:
                if topic.get("type") == "practice":
                    lesson_content.append({
                        **topic,
                        "content": "Practice exercises and review questions will be provided here."
                    })
                    continue
                chapter_info = extract_chapter_info(topic["title"])
                total_parts = None
                if chapter_info["part_number"] is not None:
                    total_parts = count_chapter_parts(lesson_list, chapter_info["base_title"])
                chapter_text = extract_chapter_text(pdf_bytes, chapter_info["base_title"], toc)
                prompt = create_gemini_prompt(
                    chapter_info, 
                    chapter_text, 
                    topic["time"],
                    total_parts
                )
                generated_content = call_gemini(prompt)
                lesson_content.append({
                    **topic,
                    "content": generated_content,
                    "chapter_info": chapter_info
                })
            generated_lessons.append({
                "lesson_number": lesson_idx + 1,
                "topics": lesson_content,
                "total_time": sum(t["time"] for t in lesson_content)
            })
        return generated_lessons
    except Exception as e:
        print(f"Error in generate_lesson_content: {e}")
        return []