from transformers import pipeline

def download_model():
    print("Downloading summarization model for local use...")
    # This will download and cache the model locally
    _ = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
    print("Model downloaded and cached.")

if __name__ == "__main__":
    download_model()
