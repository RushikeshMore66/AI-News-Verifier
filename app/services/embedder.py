from sentence_transformers import SentenceTransformer

# Initialize the local embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embedding(text):
    # Encode the text and return as a list of floats
    return model.encode(text).tolist()
