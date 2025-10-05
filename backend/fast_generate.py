from typing import List, Dict
import re
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

def extract_chapter_info(title: str) -> Dict:
    try:
        is_shortened = "(shortened)" in title.lower()
        part_match = re.search(r'\(Part (\d+)\)', title, re.IGNORECASE)
        part_number = int(part_match.group(1)) if part_match else None
        base_title = title
        base_title = re.sub(r'\s*\(shortened\)\s*', '', base_title, flags=re.IGNORECASE)
        base_title = re.sub(r'\s*\(Part \d+\)\s*', '', base_title, flags=re.IGNORECASE)
        base_title = base_title.strip()
        return {
            "base_title": base_title,
            "is_shortened": is_shortened,
            "part_number": part_number,
        }
    except Exception as e:
        print(f"Error in extract_chapter_info: {e}")
        return {
            "base_title": title,
            "is_shortened": False,
            "part_number": None,
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

def create_gemini_prompt_for_lesson(lesson_topics: List[Dict], lesson_list: List[List[Dict]]) -> str:
    """
    Creates a prompt for Gemini to generate content for an entire lesson at once.
    """
    try:
        prompt = "You are an expert educator. Generate educational content for the following lesson.\n\n"
        
        for topic in lesson_topics:
            if topic.get("type") == "practice":
                prompt += f"- Practice exercises ({topic['time']} minutes)\n"
                continue
            
            chapter_info = extract_chapter_info(topic["title"])
            target_time = topic["time"]
            
            if chapter_info["part_number"] is not None:
                total_parts = count_chapter_parts(lesson_list, chapter_info["base_title"])
                part_num = chapter_info["part_number"]
                prompt += f"- {chapter_info['base_title']} (Part {part_num} of {total_parts}): "
                prompt += f"Cover the section from approximately {(part_num-1)/total_parts*100:.0f}% to {part_num/total_parts*100:.0f}% through this chapter. "
                prompt += f"This should take approximately {target_time} minutes to read.\n"
            elif chapter_info["is_shortened"]:
                prompt += f"- {chapter_info['base_title']} (shortened version): "
                prompt += f"Focus only on the most important concepts. Leave out less relevant details. "
                prompt += f"This should take approximately {target_time} minutes to read.\n"
            else:
                prompt += f"- {chapter_info['base_title']}: "
                prompt += f"Comprehensive coverage of this topic. "
                prompt += f"This should take approximately {target_time} minutes to read.\n"
        
        prompt += "\nFor each topic listed above:\n"
        prompt += "1. Generate clear, educational content that covers the key concepts\n"
        prompt += "2. Use proper formatting with headers, bullet points, and examples where appropriate\n"
        prompt += "3. Target the specified reading time for each section\n"
        prompt += "4. For practice sections, generate relevant review questions and exercises\n"
        prompt += "\nFormat your response with clear section headers for each topic."
        
        return prompt
    except Exception as e:
        print(f"Error in create_gemini_prompt_for_lesson: {e}")
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
        import traceback
        traceback.print_exc()
        return "[Error generating content]"

def generate_lesson_content(lesson_list: List[List[Dict]]) -> List[Dict]:
    """
    Generates actual lesson content using Gemini - one API call per lesson.
    
    Args:
        lesson_list: List of lessons, each containing topic dictionaries
    
    Returns:
        List of lessons with generated content added
    """
    try:
        generated_lessons = []
        print(f"Starting generation for {len(lesson_list)} lessons...")
        
        for lesson_idx, lesson in enumerate(lesson_list):
            print(f"Processing lesson {lesson_idx + 1}/{len(lesson_list)}...")
            
            # Create single prompt for entire lesson
            prompt = create_gemini_prompt_for_lesson(lesson, lesson_list)
            
            # Generate content for entire lesson at once
            generated_content = call_gemini(prompt)
            
            # Package the lesson
            generated_lessons.append({
                "lesson_number": lesson_idx + 1,
                "topics": lesson,
                "content": generated_content,
                "total_time": sum(t["time"] for t in lesson)
            })
        
        print(f"Generation complete! Generated {len(generated_lessons)} lessons.")
        return generated_lessons
    except Exception as e:
        print(f"Error in generate_lesson_content: {e}")
        import traceback
        traceback.print_exc()
        return []