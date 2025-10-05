from flask import Flask, request, jsonify
from read_file import extract_toc
from priority import create_graph, get_learning_path
from make_lesson import make_lesson_list_from_topics
from utils import save_pdf_to_db, get_pdf_from_db

app = Flask(__name__)

@app.route("/")
def index():
    return "Hello, World!"

@app.route("/upload", methods=["POST"])
def upload_file():
    """
    Expect a PDF file upload with key 'file' in form-data.
    """
    if 'file' not in request.files:
        return "No file part", 400
    file = request.files['file']
    if file.filename == '':
        return "No selected file", 400
    try:
        # Read PDF bytes
        pdf_bytes = file.read()
        
        # Extract TOC (pass bytes, not text!)
        toc = extract_toc(pdf_bytes)
        
        print("File processed successfully")
        print(toc)  # Just print the whole thing, don't slice
        
        save_pdf_to_db(file.filename, pdf_bytes)
        print("Saved PDF to database")

        return jsonify({
            "topics": toc
        }), 200
        
    except Exception as e:
        import traceback
        tb = traceback.extract_tb(e.__traceback__)
        if tb:
            last_trace = tb[-1]
            error_line = f"{last_trace.filename}, line {last_trace.lineno}: {last_trace.line}"
        else:
            error_line = "No traceback available"
        return jsonify({"error": str(e), "error_line": error_line}), 500

@app.route("/plan", methods=["POST"])
def plan_lessons():
    """
    Expect JSON body with 'topics' key containing a list of dictionaries (each with 'title' and 'time'), and an estimated time per lesson from the user.
    Example:
    {
        "topics": [
            {"title": "Chapter 1: Introduction", "time": 20},
            {"title": "Chapter 2: Overview", "time": 10}
        ],
        "minutes_per_lesson": 30
    }
    """
    try:
        data = request.get_json()
        if not data or 'topics' not in data or 'minutes_per_lesson' not in data:
            return "Invalid input", 400
        print("Received planning request:", data)
        topics = []
        for topic in data['topics']:
            topics.append((topic['title'], topic['time'], None))  # Difficulty is None for now
        print("Creating graph...")
        G = create_graph(topics)
        print("Graph created")
        path = get_learning_path(G, False)
        print("Learning path determined:", path)

        ordered_topics = []
        for name in path:
            topic_data = next((t for t in data['topics'] if t['title'] == name), None)
            if topic_data:
                topic_dict = {
                    "title": name,
                    "time": topic_data['time']
                }
                if 2 * data['minutes_per_lesson'] < topic_data['time']:
                    topic_dict["too_much"] = True
                else:
                    topic_dict["too_much"] = False
                ordered_topics.append(topic_dict)
        print("Ordered topics:", ordered_topics)
        
        lessons = make_lesson_list_from_topics(ordered_topics, data['minutes_per_lesson'])

        return jsonify({
            "lesson_list": lessons
        }), 200
    except Exception as e:
        import traceback
        tb = traceback.extract_tb(e.__traceback__)
        if tb:
            last_trace = tb[-1]
            error_line = f"{last_trace.filename}, line {last_trace.lineno}: {last_trace.line}"
        else:
            error_line = "No traceback available"
        return jsonify({"error": str(e), "error_line": error_line}), 500
    
@app.route("/generate", methods=["POST"])
def generate_lessons():
    """
    Expect JSON body with 'filename' key containing PDF filename
    And a list of lessons with topics and times
    Example:
    {
        "filename": "mybook.pdf",
        "lesson_list": [
            [
            {
                "time": 20,
                "title": "Chapter 1: Europe in 1914 (Part 1)"
            }
            ],
            [
            {
                "time": 20,
                "title": "Chapter 1: Europe in 1914 (Part 2)"
            }
            ]
        ]
    }
    """
    try:
        data = request.get_json()
    except Exception as e:
        import traceback
        tb = traceback.extract_tb(e.__traceback__)
        if tb:
            last_trace = tb[-1]
            error_line = f"{last_trace.filename}, line {last_trace.lineno}: {last_trace.line}"
        else:
            error_line = "No traceback available"
        return jsonify({"error": str(e), "error_line": error_line}), 500
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)