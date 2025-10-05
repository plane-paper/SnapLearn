from typing import List, Dict

def shorten_lesson(topic: Dict, target_time: int) -> Dict:
    """
    Placeholder for shortening a lesson to fit target_time.
    TODO: Implement actual shortening logic
    """
    return {
        "title": topic["title"],
        "time": target_time,
        "shortened": True
    }

def make_practice(remaining_time: int) -> Dict:
    """
    Placeholder for creating practice content for remaining time.
    TODO: Implement actual practice generation logic
    """
    return {
        "title": "Practice",
        "time": remaining_time,
        "type": "practice"
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
                        "time": time_to_use,
                        "original_title": topic["title"]
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
            # Doesn't fit - check if there's room for another topic or if we need practice
            remaining_time = minutes_per_lesson - current_time
            
            # Step 7: If not enough time for another lesson, fill with practice
            if remaining_time < topic_time and current_time > 0:
                practice = make_practice(remaining_time)
                current_lesson.append(practice)
                lessons.append(current_lesson)
                current_lesson = []
                current_time = 0
            # Otherwise start a new lesson with this topic
            elif current_time == 0:
                # Edge case: topic is exactly lesson length or we're starting fresh
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