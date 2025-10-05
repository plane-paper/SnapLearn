from flask import Flask, request, jsonify
from read_file import extract_toc

app = Flask(__name__)

@app.route("/")
def index():
    return "Hello, World!"

@app.route("/upload", methods=["POST"])
def upload_file():
    
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

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)