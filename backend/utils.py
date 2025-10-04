import networkx as nx
from typing import Optional

def add_topic(graph, name, time: Optional[int] = None, difficulty: Optional[int] = None,
              completed: bool = False):
    # Here, prereq and postreq are nodes before and after the element, respectively.
    graph.add_node(name, time=time, difficulty=difficulty, completed=completed) # Note grpah is mutable

def add_dependencies(graph, name, prerequisites: Optional[list] = None, postrequisites: Optional[list] = None):
    if prerequisites: # We assume prereq are all defined already
        for prereq in prerequisites:
            graph.add_edge(prereq, name)
    if postrequisites:
        for postreq in postrequisites:
            graph.add_edge(name, postreq)

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