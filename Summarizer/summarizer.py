from transformers import pipeline

# Load locally once
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def split_text(text, max_tokens=1024):
    paragraphs = text.split('\n\n')
    chunks, current = [], ""

    for p in paragraphs:
        if len(current.split()) + len(p.split()) < max_tokens:
            current += p + "\n\n"
        else:
            chunks.append(current.strip())
            current = p
    if current:
        chunks.append(current.strip())
    return chunks


def summarize_text(text):
    chunks = split_text(text)
    summaries = []
    for chunk in chunks:
        result = summarizer(chunk, max_length=150, min_length=40, do_sample=False)
        summaries.append(result[0]['summary_text'])
    return " ".join(summaries)
