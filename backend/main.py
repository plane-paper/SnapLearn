from flask import Flask, request, jsonify
from read_file import extract_toc
from priority import create_graph, get_learning_path

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
        
        return jsonify({
            "topics": toc
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
    data = request.get_json()
    if not data or 'topics' not in data or 'minutes_per_lesson' not in data:
        return "Invalid input", 400
    topics = []
    for topic in data.topics:
        topics.append((topic['title'], topic['time'], None))  # Difficulty is None for now
    G = create_graph(topics)
    path = get_learning_path(G, False)

    minutes_per_lesson = data['minutes_per_lesson']
    

    
    

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)