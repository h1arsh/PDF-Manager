from flask import Flask, render_template, request, send_file
from transformers import pipeline
from utils import extract_text_from_pdf
from werkzeug.utils import secure_filename
import os
import io
from docx import Document
import warnings

warnings.filterwarnings("ignore", category=FutureWarning)

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load summarization pipeline once
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")

history = []  # List of tuples: (filename, summary)

def extract_text_from_docx(uploaded_file):
    uploaded_file.stream.seek(0)
    doc = Document(uploaded_file)
    fullText = []
    for para in doc.paragraphs:
        fullText.append(para.text)
    return '\n'.join(fullText)

def extract_text_from_txt(uploaded_file):
    uploaded_file.stream.seek(0)
    return uploaded_file.read().decode('utf-8')

def summarize_text(text, max_chunk=1000):
    if not text:
        return None
    chunks = [text[i:i+max_chunk] for i in range(0, len(text), max_chunk)]
    summary = ""
    for chunk in chunks:
        summary += summarizer(chunk, max_length=120, min_length=30, do_sample=False)[0]['summary_text'] + "\n"
    return summary.strip()

@app.route("/", methods=["GET", "POST"])
def index():
    summary = ""
    original = ""
    filename = ""

    if request.method == "POST":
        uploaded_file = request.files.get("file")
        if uploaded_file:
            filename = secure_filename(uploaded_file.filename)
            ext = os.path.splitext(filename)[1].lower()
            data = uploaded_file.read()

            try:
                if ext == ".pdf":
                    original = extract_text_from_pdf(data)
                elif ext == ".docx":
                    original = extract_text_from_docx(uploaded_file)
                elif ext == ".txt":
                    original = extract_text_from_txt(uploaded_file)
                else:
                    original = None

                if original:
                    summary = summarize_text(original)
                    # Save to history
                    history.append((filename, summary))
                else:
                    summary = "Failed to extract text. File may be unsupported or empty."
            except Exception as e:
                summary = f"Error processing file: {e}"

    return render_template("index.html", summary=summary, original=original, history=history, filename=filename)

@app.route("/download/<filename>", methods=["GET"])
def download(filename):
    for name, summary in history:
        if name == filename:
            base, ext = os.path.splitext(filename)
            summary_filename = f"{base}_summary.txt"
            return send_file(
                io.BytesIO(summary.encode("utf-8")),
                mimetype="text/plain",
                as_attachment=True,
                download_name=summary_filename,
            )
    return "File not found", 404

if __name__ == "__main__":
    app.run(debug=True)
