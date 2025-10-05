import networkx as nx
from typing import Optional

def add_topic(graph, name, time: Optional[int] = None, difficulty: Optional[int] = None,
              completed: bool = False):
    # Here, prereq and postreq are nodes before and after the element, respectively.
    graph.add_node(name, time=time, difficulty=difficulty, completed=completed) # Note grpah is mutable

def assign_time(entries, minutes_per_page: int = 2):
    """
    Assigns a 'time' value to each entry in the TOC list based on the number of pages the chapter covers.
    Modifies the entries in-place.
    """
    # Only consider level 1 (chapters) for time assignment
    chapters = [e for e in entries if e.get('level', 1) == 1]
    for i, chapter in enumerate(chapters):
        start_page = chapter.get('page', 1)
        # If not the last chapter, end at the next chapter's start - 1
        if i < len(chapters) - 1:
            end_page = chapters[i + 1].get('page', start_page) - 1
        else:
            # If last chapter, estimate end page as start + 10 (or you can pass total_pages)
            end_page = start_page + 10
        num_pages = max(1, end_page - start_page + 1)
        chapter['time'] = num_pages * minutes_per_page

def remove_trailing_chapters(entries):
    """
    Removes entries that are not study topics, such as 'index', 'references', etc.
    Modifies the entries list in-place.
    """
    # Common non-study section keywords (add more as needed)
    non_study_keywords = [
        "index", "references", "bibliography", "appendix", "appendices", "further reading",
        "glossary", "about the author", "acknowledgments", "acknowledgements",
        "solutions", "answer key", "credits", "maps", "list of"
    ]
    def is_study_topic(title):
        title_lower = title.lower()
        return not any(keyword in title_lower for keyword in non_study_keywords)
    
    # Filter in-place
    entries[:] = [entry for entry in entries if is_study_topic(entry.get("title", ""))]

def update_time(graph, name, success, good_multiplier: Optional[float] = 0.8, bad_multiplier: Optional[float] = 1.2):
    node = graph.nodes[name]
    if success: # Naive definition of how good the user does
        node["time"] = node["time"] * good_multiplier
    else:
        node["time"] = node["time"] * bad_multiplier

def update_difficulty(graph, name, success, good_multiplier: Optional[float] = 0.6, bad_multiplier: Optional[float] = 1.3):
    node = graph.nodes[name]
    if success:
        node["difficulty"] = max(1, round(node["difficulty"] * good_multiplier))
    else:
        node["difficulty"] = min(10, round(node["difficulty"] * bad_multiplier))

'''
For textbooks, all we need to do is look for the TOC and parse to generate topic list
Then, from topic list, we can generate the DAG
'''