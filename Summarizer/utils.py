import fitz  # PyMuPDF

def extract_text_from_pdf(data):
    text = ""
    with fitz.open(stream=data, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text
