import google.generativeai as genai
import networkx as nx
from typing import List, Dict, Tuple, Optional
import os
import time
from dotenv import load_dotenv
import matplotlib.pyplot as plt
from matplotlib.patches import Ellipse

load_dotenv()  # Load environment variables from .env file

# Configure Gemini
genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-2.5-flash')  # Free tier model


def check_prerequisite_pair(topic_a: str, topic_b: str) -> str:
    """
    Check if topic_a is a prerequisite for topic_b using Gemini.
    
    Returns:
        relationship: 'prerequisite', 'none', or 'related'
    """
    prompt = f"""Analyze the relationship between these two curriculum topics:

Topic A: {topic_a}
Topic B: {topic_b}

Determine if Topic A is a PREREQUISITE for Topic B. A prerequisite means Topic A should be learned BEFORE Topic B because Topic B builds upon or requires knowledge from Topic A.

Answer with ONLY ONE WORD:
- "prerequisite" - if A must be learned before B
- "related" - if they're related but neither is a prerequisite of the other
- "none" - if there's no meaningful relationship

Answer (one word only):"""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip().lower()
        
        print(f"\n[DEBUG] Checking {topic_a} vs {topic_b}")
        print(f"[DEBUG] Response: {text}")
        
        # Extract just the relationship keyword
        if 'prerequisite' in text:
            return 'prerequisite'
        elif 'related' in text:
            return 'related'
        else:
            return 'none'
    
    except Exception as e:
        print(f"[ERROR] Calling Gemini API: {e}")
        return 'none'


def detect_prerequisites_batch(topics: List[str]) -> List[Dict]:
    """
    Detect prerequisite relationships for a list of topics using batch processing.
    
    Args:
        topics: List of topic names
    
    Returns:
        List of dicts with 'from' and 'to' keys
    """
    prompt = f"""Analyze prerequisite relationships between these curriculum topics:

Topics: {', '.join([f'"{t}"' for t in topics])}

For each pair where one topic is a PREREQUISITE of another, list it.
A prerequisite means the first topic should be learned BEFORE the second because the second builds upon it.
Note that some topics may not have any prerequisites, or may be related but not prerequisites.
Finally, keep in mind that if A is a prerequisite for B, then B CANNOT be a prerequisite for A. This is extremely important.

Format EXACTLY as shown (one per line):
"Topic A" -> "Topic B"
"Another Topic" -> "Yet Another"

Only list clear prerequisite relationships. If you are uncertain, do not list it."""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        print(f"\n[DEBUG] Batch prompt sent with {len(topics)} topics")
        print(f"[DEBUG] Raw response:\n{text}\n")
        
        # Parse response
        prerequisites = []
        for line in text.split('\n'):
            line = line.strip()
            print(f"[DEBUG] Parsing line: {line}")
            
            if '->' in line:
                # Extract topic names
                topic_parts = line.split('->')
                topic_a = topic_parts[0].strip(' "')
                topic_b = topic_parts[1].strip(' "')
                
                print(f"[DEBUG] Extracted: '{topic_a}' -> '{topic_b}'")
                print(f"[DEBUG] '{topic_a}' in topics: {topic_a in topics}")
                print(f"[DEBUG] '{topic_b}' in topics: {topic_b in topics}")
                
                # Verify topics are in original list
                if topic_a in topics and topic_b in topics:
                    prerequisites.append({
                        'from': topic_a,
                        'to': topic_b
                    })
                    print(f"[DEBUG] ✓ Added prerequisite: {topic_a} -> {topic_b}")
                else:
                    print(f"[DEBUG] ✗ Skipped - topics not in original list")
        
        print(f"\n[DEBUG] Total prerequisites found: {len(prerequisites)}")
        return prerequisites
    
    except Exception as e:
        print(f"[ERROR] In batch processing: {e}")
        import traceback
        traceback.print_exc()
        return []


def auto_add_dependencies(graph: nx.DiGraph, topics: List[str], 
                         mode: str = 'batch',
                         rate_limit_delay: float = 0.5) -> int:
    """
    Automatically detect and add prerequisite dependencies to your graph.
    
    Args:
        graph: NetworkX DiGraph (should already have nodes added)
        topics: List of topic names to analyze (should match node names in graph)
        mode: 'batch' (faster, recommended) or 'pairwise' (more thorough)
        rate_limit_delay: Seconds to wait between API calls (for rate limiting)
    
    Returns:
        Number of prerequisite edges added
    """
    edges_added = 0
    
    print(f"\n[DEBUG] Starting auto_add_dependencies")
    print(f"[DEBUG] Mode: {mode}")
    print(f"[DEBUG] Topics to analyze: {topics}")
    print(f"[DEBUG] Graph nodes: {list(graph.nodes())}")
    
    # Verify all topics exist as nodes
    missing_topics = [t for t in topics if t not in graph.nodes]
    if missing_topics:
        print(f"[WARNING] These topics are not in the graph: {missing_topics}")
        topics = [t for t in topics if t in graph.nodes]
    
    print(f"[DEBUG] Topics after filtering: {topics}")
    
    if mode == 'batch':
        print(f"\nDetecting prerequisites for {len(topics)} topics (batch mode)...")
        prerequisites = detect_prerequisites_batch(topics)
        
        print(f"\n[DEBUG] Prerequisites returned: {prerequisites}")
        
        for prereq in prerequisites:
            # Check if edge doesn't already exist
            if not graph.has_edge(prereq['from'], prereq['to']):
                graph.add_edge(prereq['from'], prereq['to'])
                edges_added += 1
                print(f"  ✓ Added edge: {prereq['from']} → {prereq['to']}")
            else:
                print(f"  ○ Edge already exists: {prereq['from']} → {prereq['to']}")
        
    elif mode == 'pairwise':
        print(f"Detecting prerequisites for {len(topics)} topics (pairwise mode)...")
        print(f"Warning: This will make ~{len(topics) * (len(topics) - 1) // 2} API calls")
        
        for i, topic_a in enumerate(topics):
            for topic_b in topics[i+1:]:
                # Check both directions
                rel_ab = check_prerequisite_pair(topic_a, topic_b)
                
                if rel_ab == 'prerequisite':
                    if not graph.has_edge(topic_a, topic_b):
                        graph.add_edge(topic_a, topic_b)
                        edges_added += 1
                        print(f"  ✓ {topic_a} → {topic_b}")
                
                # Check reverse direction
                rel_ba = check_prerequisite_pair(topic_b, topic_a)
                
                if rel_ba == 'prerequisite':
                    if not graph.has_edge(topic_b, topic_a):
                        graph.add_edge(topic_b, topic_a)
                        edges_added += 1
                        print(f"  ✓ {topic_b} → {topic_a}")
                
                # Rate limiting
                time.sleep(rate_limit_delay)
    
    else:
        raise ValueError(f"Invalid mode: {mode}. Use 'batch' or 'pairwise'")
    
    print(f"\n[RESULT] Added {edges_added} prerequisite edges")
    return edges_added


def get_learning_path(graph: nx.DiGraph, completed_only: bool = False) -> List[str]:
    """
    Get a suggested learning path using topological sort.
    Ensures every node is touched and only touched once.

    Args:
        graph: NetworkX DiGraph with prerequisite edges
        completed_only: If True, only include incomplete topics

    Returns:
        List of topics in suggested learning order
    """
    try:
        # Filter nodes if needed
        if completed_only:
            nodes_to_include = [n for n in graph.nodes()
                                if not graph.nodes[n].get('completed', False)]
            subgraph = graph.subgraph(nodes_to_include).copy()
        else:
            subgraph = graph.copy()

        # Topological sort gives learning order
        learning_path = list(nx.topological_sort(subgraph))

        # Ensure all nodes are included exactly once
        all_nodes = set(subgraph.nodes())
        path_set = set(learning_path)
        missing = all_nodes - path_set
        extra = path_set - all_nodes

        # Add any missing nodes at the end (shouldn't happen unless graph is disconnected)
        learning_path += list(missing)

        # Remove any extras (shouldn't happen)
        learning_path = [n for n in learning_path if n in all_nodes]

        # Remove duplicates while preserving order
        seen = set()
        unique_path = []
        for n in learning_path:
            if n not in seen:
                unique_path.append(n)
                seen.add(n)

        return unique_path

    except nx.NetworkXError:
        print("Warning: Cycle detected in prerequisites. Cannot create linear path.")
        # Return all nodes sorted by difficulty as fallback, each only once
        if completed_only:
            nodes_with_difficulty = [(n, graph.nodes[n].get('difficulty', 5))
                                     for n in graph.nodes()
                                     if not graph.nodes[n].get('completed', False)]
        else:
            nodes_with_difficulty = [(n, graph.nodes[n].get('difficulty', 5))
                                     for n in graph.nodes()]
        # Remove duplicates and preserve order
        seen = set()
        sorted_nodes = []
        for n, _ in sorted(nodes_with_difficulty, key=lambda x: x[1]):
            if n not in seen:
                sorted_nodes.append(n)
                seen.add(n)
        return sorted_nodes


def suggest_next_topics(graph: nx.DiGraph, n: int = 3) -> List[str]:
    """
    Suggest the next N topics to study based on:
    1. Not yet completed
    2. All prerequisites are completed
    3. Sorted by difficulty (easier first)
    
    Args:
        graph: NetworkX DiGraph
        n: Number of topics to suggest
    
    Returns:
        List of suggested topic names
    """
    available_topics = []
    
    for node in graph.nodes():
        node_data = graph.nodes[node]
        
        # Skip if already completed
        if node_data.get('completed', False):
            continue
        
        # Check if all prerequisites are completed
        prerequisites = list(graph.predecessors(node))
        all_prereqs_done = all(
            graph.nodes[prereq].get('completed', False) 
            for prereq in prerequisites
        )
        
        if all_prereqs_done:
            difficulty = node_data.get('difficulty', 5)
            time_estimate = node_data.get('time', 0)
            available_topics.append((node, difficulty, time_estimate))
    
    # Sort by difficulty (ascending), then by time
    available_topics.sort(key=lambda x: (x[1], x[2]))
    
    return [topic for topic, _, _ in available_topics[:n]]

def create_graph(G: nx.DiGraph, topics: List[Tuple[str, int, int]]):
    # Add all topics
    print("Adding topics to graph...")
    for name, time_val, difficulty in topics:
        G.add_node(name, time=time_val, difficulty=difficulty, completed=False)
    
    # Auto-detect prerequisites using Gemini
    topic_names = [name for name, _, _ in topics]
    auto_add_dependencies(G, topic_names, mode='batch')
    
    return G

def visualize(inp: nx.DiGraph | List):
    if isinstance(inp, nx.DiGraph):
        G = inp
        pos = nx.spring_layout(G, k=3, iterations=50)
        num_nodes = G.number_of_nodes()
        fig_width = max(14, num_nodes * 1.5)
        fig_height = max(10, num_nodes * 1.0)
        # Scale for spring layout (normalized 0-1)
        width_scale = 1.0
        height_scale = 1.0
    else:
        G = nx.DiGraph()
        for i in range(len(inp) - 1):
            G.add_edge(inp[i], inp[i + 1])
        
        pos = {}
        # Vertical spacing (top to bottom)
        spacing = 3
        for i, node in enumerate(inp):
            pos[node] = (0, -i * spacing)  # Negative for top-to-bottom
        
        # Adjust figure dimensions for vertical layout
        fig_width = 10
        fig_height = max(20, len(inp) * 3)
        # Swap width and height scales for vertical orientation
        width_scale = 0.015  # Wide ovals 
        height_scale = 10.0  # Less tall
    
    all_labels = [str(node) for node in G.nodes()]
    max_label_length = max(len(label) for label in all_labels)
    
    num_nodes = G.number_of_nodes()
    font_size = max(10, min(13, 150 / max(1, num_nodes ** 0.5)))
    
    fig, ax = plt.subplots(figsize=(fig_width, fig_height))
    
    # Draw edges with arrows
    margin_scale = max(width_scale, height_scale)
    nx.draw_networkx_edges(G, pos,
                          arrowstyle='-|>',
                          arrowsize=35,
                          arrows=True,
                          edge_color='gray',
                          width=2.5,
                          connectionstyle='arc3,rad=0.0',
                          min_source_margin=60 * margin_scale,
                          min_target_margin=60 * margin_scale,
                          ax=ax)
    
    # Draw nodes as ovals/ellipses
    from matplotlib.patches import Ellipse
    
    for node in G.nodes():
        text_length = len(str(node))
        # Wide horizontal ovals
        width = max(0.25, text_length * 0.035) * width_scale
        height = 0.12 * height_scale

        # Use a default position if not found (for disconnected nodes)
        node_pos = pos.get(node, (0, 0))
        ellipse = Ellipse(node_pos, width, height,
                         facecolor='lightblue',
                         edgecolor='black',
                         linewidth=2)
        ax.add_patch(ellipse)
    
    # Draw labels
    nx.draw_networkx_labels(G, pos,
                           font_size=font_size,
                           font_weight='bold',
                           font_color='black',
                           ax=ax)
    
    plt.title("Learning Path Graph", fontsize=16, pad=-20)
    plt.axis('off')
    plt.margins(0.2)
    #plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    # Create graph and add topics
    G = nx.DiGraph()
    
    topics = [
        ("Database Design", 20, 6),
        ("Data Structures", 20, 7),
        ("API Development", 25, 8),
        
        ("Variables and Data Types", 5, 1),
        ("Control Flow", 8, 3),
        
        ("Object-Oriented Programming", 15, 6),
        
        ("Python Basics", 10, 2),
        ("Algorithms", 25, 8),
        ("Web Development with Flask", 30, 7),
        ("Functions", 10, 4),
    ]

    G = create_graph(G, topics)

    # Get learning path
    print("\n" + "="*60)
    print("SUGGESTED LEARNING PATH")
    print("="*60)
    path = get_learning_path(G)
    for i, topic in enumerate(path, 1):
        node_data = G.nodes[topic]
        completed = "✓" if node_data.get('completed') else "○"
        difficulty = node_data.get('difficulty', '?')
        time_est = node_data.get('time', '?')
        print(f"{i}. {completed} {topic} (Difficulty: {difficulty}, Time: {time_est}h)")
    
    #visualize(G)
    
    # # Suggest next topics to study
    # print("\n" + "="*60)
    # print("SUGGESTED NEXT TOPICS")
    # print("="*60)
    # next_topics = suggest_next_topics(G, n=3)
    # for i, topic in enumerate(next_topics, 1):
    #     node_data = G.nodes[topic]
    #     difficulty = node_data.get('difficulty', '?')
    #     time_est = node_data.get('time', '?')
    #     print(f"{i}. {topic} (Difficulty: {difficulty}, Time: {time_est}h)")
        
    #     # Show what prerequisites are done
    #     prereqs = list(G.predecessors(topic))
    #     if prereqs:
    #         print(f"   Prerequisites: {', '.join(prereqs)}")