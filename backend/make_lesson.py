from typing import List, Dict

def shorten_lesson(topic: Dict, target_time: int) -> Dict:
    new_title = topic["title"] + " (Shortened)"

    return {
        "title": new_title,
        "time": target_time,
    }

def make_practice(remaining_time: int) -> Dict:
    return {
        "title": "Practice",
        "time": remaining_time,
    }

def make_lesson_list_from_topics(topics: List[Dict], minutes_per_lesson: int) -> List[List[Dict]]:
    """
    Creates a list of lessons from topics, each lesson being a list of topic segments.
    
    Args:
        topics: List of topic dictionaries with 'title', 'time', and 'too_much' keys
        minutes_per_lesson: Target duration for each lesson in minutes
    
    Returns:
        List of lessons, where each lesson is a list of topic/practice dictionaries
    """
    try:
        lessons = []
        current_lesson = []
        current_time = 0
        topic_index = 0
        
        while topic_index < len(topics):
            topic = topics[topic_index]
            
            # Skip if marked as too_much (we'll handle breaking it up)
            if topic.get("too_much", False):
                # Step 5: Break up the topic into smaller pieces
                remaining_topic_time = topic["time"]
                part_number = 1
                
                while remaining_topic_time > 0:
                    # How much time left in current lesson?
                    available_time = minutes_per_lesson - current_time
                    
                    if available_time >= minutes_per_lesson * 0.5:  # If we have at least half a lesson worth of time
                        # Add a part of this topic
                        time_to_use = min(available_time, remaining_topic_time)
                        current_lesson.append({
                            "title": f"{topic['title']} (Part {part_number})",
                            "time": time_to_use
                        })
                        current_time += time_to_use
                        remaining_topic_time -= time_to_use
                        part_number += 1
                        
                        # If lesson is full, finalize it
                        if current_time >= minutes_per_lesson:
                            lessons.append(current_lesson)
                            current_lesson = []
                            current_time = 0
                    else:
                        # Not enough room, add practice and start new lesson
                        if current_time > 0:
                            practice = make_practice(minutes_per_lesson - current_time)
                            current_lesson.append(practice)
                            lessons.append(current_lesson)
                            current_lesson = []
                            current_time = 0
                
                topic_index += 1
                continue
            
            # Step 3-4: Regular topic handling
            topic_time = topic.get("time", 0)
            
            # If topic is longer than desired lesson length but not marked too_much, shorten it
            if topic_time > minutes_per_lesson:
                topic = shorten_lesson(topic, minutes_per_lesson)
                topic_time = topic["time"]
            
            # Step 6: Check if we can fit this topic in the current lesson
            if current_time + topic_time <= minutes_per_lesson:
                # Fits in current lesson
                current_lesson.append(topic)
                current_time += topic_time
                topic_index += 1
            else:
                # Doesn't fit in current lesson
                if current_time > 0:
                    # Step 7: Fill remaining time with practice and finalize this lesson
                    remaining_time = minutes_per_lesson - current_time
                    practice = make_practice(remaining_time)
                    current_lesson.append(practice)
                    lessons.append(current_lesson)
                    current_lesson = []
                    current_time = 0
                    # DON'T increment topic_index - we'll process this topic in the next iteration
                else:
                    # Edge case: we're at the start of a new lesson, add the topic
                    current_lesson.append(topic)
                    current_time += topic_time
                    topic_index += 1
        
        # Handle any remaining content in current_lesson
        if current_lesson:
            remaining_time = minutes_per_lesson - current_time
            if remaining_time > 0:
                practice = make_practice(remaining_time)
                current_lesson.append(practice)
            lessons.append(current_lesson)
        
        return lessons
    except Exception as e:
        import traceback
        tb = traceback.extract_tb(e.__traceback__)
        if tb:
            last_trace = tb[-1]
            error_line = f"{last_trace.filename}, line {last_trace.lineno}: {last_trace.line}"
        else:
            error_line = "No traceback available"
        raise RuntimeError(f"Error in make_lesson_list_from_topics: {str(e)} at {error_line}")